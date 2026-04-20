import { IEmiNotificationCronService } from "@/interfaces/helper/emi.notification.crone.service";
import { IEmiRepository } from "@/interfaces/repositories/emi/emi.repository.interface";
import { ILoanRepository } from "@/interfaces/repositories/loan/loan.repository.interface";
import { ILoanApplicationRepository } from "@/interfaces/repositories/loanApplication/loan.application.interface";
import { IUserRepository } from "@/interfaces/repositories/user/userRepository.interface";
import { INotificationService } from "@/interfaces/services/notifications/notification.service.interface";
import { IVendorNotificationService } from "@/interfaces/services/notifications/vendor.notification.service.interface.";
import {
  EmiStatus,
  NotificationType,
  VendorNotificationType,
} from "@/models/enums/enum";
import { inject, injectable } from "tsyringe";

@injectable()
export class EmiNotificationCronService implements IEmiNotificationCronService {
  constructor(
    @inject("IEmiRepository") private readonly _iEmiRepository: IEmiRepository,
    @inject("ILoanRepository") private _iLoanRepository: ILoanRepository,
    @inject("INotificationService")
    private _iNotificationService: INotificationService,
    @inject("IVendorNotificationService")
    private readonly _iVendorNotificationService: IVendorNotificationService,
    @inject("IUserRepository")
    private readonly _iUserRepository: IUserRepository,
    @inject("ILoanApplicationRepository")
    private readonly _iLoanApplicationRepository: ILoanApplicationRepository,
  ) {}

  async run(): Promise<void> {
    const now = new Date();

    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const twoDaysLater = new Date(now);
    twoDaysLater.setDate(twoDaysLater.getDate() + 2);
    const twoDaysStart = new Date(twoDaysLater);
    twoDaysStart.setHours(0, 0, 0, 0);
    const twoDaysEnd = new Date(twoDaysLater);
    twoDaysEnd.setHours(23, 59, 59, 999);

    await this.notifyDueInTwoDays(twoDaysStart, twoDaysEnd);
    await this.notifyDueToday(todayStart, todayEnd);
    await this.notifyOverdueEmis(todayStart);
  }

  async notifyDueInTwoDays(startDate: Date, endDate: Date): Promise<void> {
    const emis = await this._iEmiRepository.findEmiByDueDate(
      startDate,
      endDate,
    );
    for (const emi of emis) {
      if (emi.status === EmiStatus.PAID) continue;

      const loan = await this._iLoanRepository.findById(emi.loan.toString());
      if (!loan) continue;

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const exists = await this._iNotificationService.checkNotificationExists(
        emi._id.toString(),
        NotificationType.EMI_DUE_SOON,
        todayStart,
        todayEnd,
      );

      if (exists) continue;

      await this._iNotificationService.createNotification({
        userId: loan.user.toString(),
        emiId: emi._id.toString(),
        title: "EMI Reminder",
        message: `Your EMI of ₹${emi.amount} is due in 2 days.`,
        type: NotificationType.EMI_DUE_SOON,
      });
    }
  }

  async notifyDueToday(startDate: Date, endDate: Date): Promise<void> {
    const emis = await this._iEmiRepository.findEmiByDueDate(
      startDate,
      endDate,
    );
    for (const emi of emis) {
      if (emi.status === EmiStatus.PAID) continue;

      const loan = await this._iLoanRepository.findById(emi.loan.toString());
      if (!loan) continue;

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const exists = await this._iNotificationService.checkNotificationExists(
        emi._id.toString(),
        NotificationType.EMI_DUE_TODAY,
        todayStart,
        todayEnd,
      );

      if (exists) continue;

      await this._iNotificationService.createNotification({
        userId: loan.user.toString(),
        emiId: emi._id.toString(),
        title: "EMI Due Today",
        message: `Your EMI of ₹${emi.amount} is due today.`,
        type: NotificationType.EMI_DUE_TODAY,
      });
    }
  }

  async notifyOverdueEmis(currentDate: Date): Promise<void> {
    const emis = await this._iEmiRepository.findOverDueEmis(currentDate);

    const todayStart = new Date(currentDate);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(currentDate);
    todayEnd.setHours(23, 59, 59, 999);

    for (const emi of emis) {
      if (emi.status === EmiStatus.PAID) continue;

      const loan = await this._iLoanRepository.findById(emi.loan.toString());
      if (!loan) continue;

      const user = await this._iUserRepository.findById(loan.user.toString());

      const application = await this._iLoanApplicationRepository.findById(
        loan.applicationId.toString(),
      );
      if (!user || !application) continue;

      const dueDate = new Date(emi.dueDate);
      const diffTime = currentDate.getTime() - dueDate.getTime();
      const overdueDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // 1. Mark as OVERDUE if at least 1 day late
      if (overdueDays >= 1 && emi.status !== EmiStatus.OVERDUE) {
        emi.status = EmiStatus.OVERDUE;
        await (emi as typeof emi & Document).save(); // Using any to bypass potential document property issues in this context
      }

      // 2. Penalty Logic: Day 3 (overdueDays 2) = 500, Days 4-8 = +100/day (Max 1000)
      let targetPenalty = 0;
      if (overdueDays === 2) {
        targetPenalty = 500;
      } else if (overdueDays > 2) {
        targetPenalty = 500 + Math.min(overdueDays - 2, 5) * 100;
      }

      const alreadyAppliedToday =
        emi.lastPenaltyAppliedAt &&
        emi.lastPenaltyAppliedAt >= todayStart &&
        emi.lastPenaltyAppliedAt <= todayEnd;

      if (!alreadyAppliedToday && targetPenalty > (emi.penalty ?? 0)) {
        await this._iEmiRepository.updatePenaltyAndStatus(
          emi._id.toString(),
          targetPenalty,
          EmiStatus.OVERDUE,
          new Date(),
        );

        await this._iNotificationService.createNotification({
          userId: loan.user.toString(),
          emiId: emi._id.toString(),
          title: "EMI Overdue Penalty",
          message: `Your EMI is ${overdueDays + 1} days overdue. A penalty of ₹${targetPenalty} has been applied.`,
          type: NotificationType.EMI_OVERDUE,
        });

        //Vendor Notification
        await this._iVendorNotificationService.createOverdueNotificationIfNotExists(
          {
            vendorId: application.vendorId.toString(),
            userId: loan.user.toString(),
            loanId: loan._id.toString(),
            emiId: emi._id.toString(),
            title: "User EMI Overdue",
            message: `${user.name} has an overdue EMI. Penalty applied: ₹${targetPenalty}.`,
            type: VendorNotificationType.USER_EMI_OVERDUE,
          },
        );
      }

      

      // 3. High Risk / Danger Notification (at Day 9 / overdueDays 8)
      if (overdueDays >= 8 && !emi.highRiskNotified) {
        await this._iNotificationService.createNotification({
          userId: loan.user.toString(),
          emiId: emi._id.toString(),
          title: "Account at High Risk",
          message:
            "DANGER: Your EMI is critically overdue. Please pay immediately to avoid legal action.",
          type: NotificationType.EMI_OVERDUE,
        });

         await this._iVendorNotificationService.createNotification({
        vendorId: application.vendorId.toString(),
        userId: loan.user.toString(),
        loanId: loan._id.toString(),
        emiId: emi._id.toString(),
        title: "User EMI at High Risk",
        message: `${user.name}'s EMI is critically overdue and the account is now high risk.`,
        type: VendorNotificationType.USER_EMI_HIGH_RISK,
      });
        await this._iEmiRepository.markHighRiskNotified(emi._id.toString());
      }
    }
  }
}
