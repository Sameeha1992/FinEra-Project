import { MESSAGES } from "@/config/constants/message";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { EmiListingLoans } from "@/dto/emi/create.emi.dto";
import { IStripeService } from "@/interfaces/helper/stripe.service.interface";
import { IEmiRepository } from "@/interfaces/repositories/emi/emi.repository.interface";
import { ILoanRepository } from "@/interfaces/repositories/loan/loan.repository.interface";
import { IEmiPaymentService } from "@/interfaces/services/emi/emi.payment.interface";
import { INotificationService } from "@/interfaces/services/notifications/notification.service.interface";
import { EmiMapper } from "@/mappers/emi/emi.mappers";
import { CustomError } from "@/middleware/errorMiddleware";
import { EmiStatus } from "@/models/enums/enum";
import { env } from "@/validations/envValidation";
import { inject, injectable } from "tsyringe";
import { NotificationType } from "@/models/enums/enum";

@injectable()
export class EmiPaymentSerive implements IEmiPaymentService {
  constructor(
    @inject("IEmiRepository") private _iEmiRepository: IEmiRepository,
    @inject("ILoanRepository") private _iLoanRepository: ILoanRepository,
    @inject("IStripeService") private _iStripeService: IStripeService,
    @inject("INotificationService")
    private readonly _iNotificationService: INotificationService,
  ) {}
  async createEmiPaymentSession(
    emiId: string,
    userId: string,
  ): Promise<{ success: boolean; message: string; checkoutUrl: string }> {
    if (!emiId || !userId) {
      throw new CustomError(MESSAGES.INVALID_REQUEST, STATUS_CODES.BAD_REQUEST);
    }

    const emi = await this._iEmiRepository.findEmiById(emiId);

    if (!emi) {
      throw new CustomError(MESSAGES.EMI_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    if (emi.status === EmiStatus.PAID) {
      throw new CustomError(
        MESSAGES.EMI_ALREADY_PAID,
        STATUS_CODES.BAD_REQUEST,
      );
    }

    const refreshedEmi = await this.refreshEmiStatus(emiId);

    if (refreshedEmi.status === EmiStatus.UPCOMING) {
      throw new CustomError(
        MESSAGES.EMI_NOT_YET_PAYABLE,
        STATUS_CODES.BAD_REQUEST,
      );
    }

    const loan = await this._iLoanRepository.findById(emi.loan.toString());

    if (!loan) {
      throw new CustomError(MESSAGES.LOAN_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    if (loan.user.toString() !== userId) {
      throw new CustomError(
        MESSAGES.UNAUTHORIZED_ACCESS,
        STATUS_CODES.FORBIDDEN,
      );
    }

    const totalAmount = refreshedEmi.amount + (refreshedEmi.penalty ?? 0);

    const lockedEmi = await this._iEmiRepository.lockEmiForPayment(emiId);

    if (!lockedEmi) {
      const currentEmi = await this._iEmiRepository.findEmiById(emiId);

      // If it's already PAID, throw specific error
      if (currentEmi?.status === EmiStatus.PAID) {
        throw new CustomError(MESSAGES.EMI_ALREADY_PAID, STATUS_CODES.BAD_REQUEST);
      }

      // If it's in progress and NOT expired (since lockEmiForPayment failed), it's a genuine concurrent attempt or a very recent lock
      if (currentEmi?.status === EmiStatus.PAYMENT_IN_PROGRESS) {
        throw new CustomError(MESSAGES.EMI_PAYMENT_ALREADY_IN_PROGRESS, STATUS_CODES.BAD_REQUEST);
      }

      throw new CustomError(
        MESSAGES.UNABLE_TO_PROCESS_PAYMENT,
        STATUS_CODES.BAD_REQUEST,
      );
    }
    try {
      const checkoutUrl = await this._iStripeService.createCheckoutSession({
        emiId: refreshedEmi.emiId,
        emiNumber: refreshedEmi.emiNumber,
        loanId: loan._id.toString(),
        amount: totalAmount,
        userId: userId,
        successUrl: `${env.CORS_ORIGIN}/user/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${env.CORS_ORIGIN}/user/payment-cancel`,
      });

      return {
        success: true,
        message: MESSAGES.STRIPE_CHECKOUT_SESSION_CREATED,
        checkoutUrl,
      };
    } catch (error) {
      await this._iEmiRepository.updateEmiStatus(
        emiId,
        refreshedEmi.penalty && refreshedEmi.penalty > 0
          ? EmiStatus.OVERDUE
          : EmiStatus.PENDING,
      );
      throw error;
    }
  }

  async refreshEmiStatus(emiId: string): Promise<EmiListingLoans> {
    const emi = await this._iEmiRepository.findEmiById(emiId);

    if (!emi) {
      throw new CustomError(MESSAGES.EMI_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    if (emi.status === EmiStatus.PAID) {
      return EmiMapper.toListingDto(emi);
    }

    // Self-Healing Lock: If payment is in progress but lock is expired (>2 mins),
    // allow the status to recalculate (unlocking it).
    if (emi.status === EmiStatus.PAYMENT_IN_PROGRESS) {
      const LOCK_TIMEOUT_MS = 1 * 60 * 1000;
      const isExpired =
        !emi.paymentLockedAt ||
        Date.now() - new Date(emi.paymentLockedAt).getTime() > LOCK_TIMEOUT_MS;

      if (!isExpired) {
        return EmiMapper.toListingDto(emi);
      }
      // If expired, fall through to re-calculate (PENDING/OVERDUE)
    }

    const today = new Date();
    const dueDate = new Date(emi.dueDate);

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - dueDate.getTime();
    const overdueDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (overdueDays < 0) {
      if (emi.status === EmiStatus.UPCOMING) {
        return EmiMapper.toListingDto(emi);
      }
      const updatedEmi = await this._iEmiRepository.updateEmiStatus(
        emiId,
        EmiStatus.UPCOMING,
      );
      return EmiMapper.toListingDto(updatedEmi!);
    }

    if (overdueDays === 0) {
      if (emi.status === EmiStatus.PENDING) {
        return EmiMapper.toListingDto(emi);
      }
      const updatedEmi = await this._iEmiRepository.updateEmiStatus(
        emiId,
        EmiStatus.PENDING,
      );
      return EmiMapper.toListingDto(updatedEmi!);
    }

    // Overdue Logic: Day 3 (overdueDays 2) = 500, Days 4-8 = +100/day (Max 1000)
    let targetPenalty = 0;
    if (overdueDays === 2) {
      targetPenalty = 500;
    } else if (overdueDays > 2) {
      targetPenalty = 500 + Math.min(overdueDays - 2, 5) * 100;
    }

    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const alreadyAppliedToday =
      emi.lastPenaltyAppliedAt &&
      emi.lastPenaltyAppliedAt >= todayStart &&
      emi.lastPenaltyAppliedAt <= todayEnd;

    let finalStatus = EmiStatus.OVERDUE;
    let finalPenalty = emi.penalty ?? 0;
    let needsUpdate = false;

    if (emi.status !== finalStatus) {
      needsUpdate = true;
    }

    if (!alreadyAppliedToday && targetPenalty > finalPenalty) {
      finalPenalty = targetPenalty;
      needsUpdate = true;
    }

    if (needsUpdate) {
      const updatedEmi = await this._iEmiRepository.updatePenaltyAndStatus(
        emiId,
        finalPenalty,
        finalStatus,
        new Date(),
      );

      // Trigger danger notification if Day 9+
      if (overdueDays >= 8 && !updatedEmi?.highRiskNotified) {
        const loan = await this._iLoanRepository.findById(emi.loan.toString());
        if (loan) {
          await this._iNotificationService.createNotification({
            userId: loan.user.toString(),
            emiId: emiId,
            title: "Account at High Risk",
            message:
              "DANGER: Your EMI is critically overdue. Please pay immediately to avoid legal action.",
            type: NotificationType.EMI_OVERDUE,
          });
          await this._iEmiRepository.markHighRiskNotified(emiId);
        }
      }
      return EmiMapper.toListingDto(updatedEmi!);
    }

    return EmiMapper.toListingDto(emi);
  }

  async handleSuccessfulEmiPayment(emiId: string): Promise<EmiListingLoans> {
    if (!emiId) {
      throw new CustomError(MESSAGES.INVALID_REQUEST, STATUS_CODES.BAD_REQUEST);
    }

    const emi = await this._iEmiRepository.findEmiById(emiId);

    if (!emi) {
      throw new CustomError(MESSAGES.EMI_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    if (emi.status === EmiStatus.PAID) {
      return EmiMapper.toListingDto(emi);
    }

    const refreshedEmi = await this.refreshEmiStatus(emiId);

    if (refreshedEmi.status === EmiStatus.UPCOMING) {
      throw new CustomError(
        MESSAGES.EMI_NOT_YET_PAYABLE,
        STATUS_CODES.BAD_REQUEST,
      );
    }

    const paidEmi = await this._iEmiRepository.markEmiAsPaid(emiId, new Date());
    if (!paidEmi) {
      throw new CustomError(MESSAGES.EMI_ALREADY_PAID, STATUS_CODES.NOT_FOUND);
    }

    const loan = await this._iLoanRepository.findById(paidEmi.loan.toString());
    if (!loan) {
      throw new CustomError(MESSAGES.LOAN_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }
    await this._iNotificationService.createNotification({
      userId: loan.user.toString(),
      emiId: paidEmi._id.toString(),
      title: "Payment Successful",
      message: `Your EMI of ₹${paidEmi.amount + (paidEmi.penalty ?? 0)} was paid successfully.`,
      type: NotificationType.PAYMENT_SUCCESS,
    });
    return EmiMapper.toListingDto(paidEmi);
  }
}
