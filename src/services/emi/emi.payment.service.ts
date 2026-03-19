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
      throw new CustomError(MESSAGES.EMI_ALREADY_PAID, STATUS_CODES.NOT_FOUND);
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
  }

  async refreshEmiStatus(emiId: string): Promise<EmiListingLoans> {
    const emi = await this._iEmiRepository.findEmiById(emiId);

    if (!emi) {
      throw new CustomError(MESSAGES.EMI_ALREADY_PAID, STATUS_CODES.NOT_FOUND);
    }

    if (emi.status === EmiStatus.PAID) {
      return EmiMapper.toListingDto(emi);
    }

    const today = new Date();
    const dueDate = new Date(emi.dueDate);

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const graceEndDate = new Date(dueDate);
    graceEndDate.setDate(graceEndDate.getDate() + 2);
    graceEndDate.setHours(23, 59, 59, 999);

    if (today < dueDate) {
      if (emi.status === EmiStatus.UPCOMING) {
        return EmiMapper.toListingDto(emi);
      }

      const updatedEmi = await this._iEmiRepository.updateEmiStatus(
        emiId,
        EmiStatus.UPCOMING,
      );

      if (!updatedEmi) {
        throw new CustomError(MESSAGES.EMI_NOT_FOUND, STATUS_CODES.NOT_FOUND);
      }

      return EmiMapper.toListingDto(updatedEmi);
    }

    if (today <= graceEndDate) {
      if (emi.status === EmiStatus.PENDING) {
        return EmiMapper.toListingDto(emi);
      }

      const updatedEmi = await this._iEmiRepository.updateEmiStatus(
        emiId,
        EmiStatus.PENDING,
      );

      if (!updatedEmi) {
        throw new CustomError(MESSAGES.EMI_NOT_FOUND, STATUS_CODES.NOT_FOUND);
      }

      return EmiMapper.toListingDto(updatedEmi);
    }

    if (emi.status === EmiStatus.OVERDUE) {
      return EmiMapper.toListingDto(emi);
    }

    const updatedEmi = await this._iEmiRepository.updateEmiStatus(
      emiId,
      
      EmiStatus.OVERDUE,
    );

    if (!updatedEmi) {
      throw new CustomError(MESSAGES.EMI_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    return EmiMapper.toListingDto(updatedEmi);
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
      message: `Your EMI of ₹${paidEmi.amount +(paidEmi.penalty ?? 0)} was paid successfully.`,
      type: NotificationType.PAYMENT_SUCCESS,
    });
    return EmiMapper.toListingDto(paidEmi);
  }
}
