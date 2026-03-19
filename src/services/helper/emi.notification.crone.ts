import { IEmiNotificationCronService } from "@/interfaces/helper/emi.notification.crone.service";
import { IEmiRepository } from "@/interfaces/repositories/emi/emi.repository.interface";
import { ILoanRepository } from "@/interfaces/repositories/loan/loan.repository.interface";
import { INotificationService } from "@/interfaces/services/notifications/notification.service.interface";
import { EmiStatus, NotificationType } from "@/models/enums/enum";
import { inject, injectable } from "tsyringe";

@injectable()
export class EmiNotificationCronService implements IEmiNotificationCronService {
  constructor(
    @inject("IEmiRepository") private readonly _iEmiRepository: IEmiRepository,
    @inject("ILoanRepository") private _iLoanRepository: ILoanRepository,
    @inject("INotificationService") private _iNotificationService:INotificationService,
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

    const emis = await this._iEmiRepository.findEmiByDueDate(startDate,endDate);
    for (const emi of emis) {
      if (emi.status === EmiStatus.PAID) continue;

      const loan = await this._iLoanRepository.findById(emi.loan.toString());
      if (!loan) continue;

      await this._iNotificationService.createNotification({
        userId: loan.user.toString(),
        emiId: emi._id.toString(),
        title: "EMI Reminder",
        message: `Your EMI of ₹${emi.amount} is due in 2 days.`,
        type: NotificationType.EMI_DUE_SOON
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



  const DAILY_PENALTY = 100;
  const MAX_PENALTY = 500;

  const todayStart = new Date(currentDate);
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date(currentDate);
  todayEnd.setHours(23, 59, 59, 999);

     for (const emi of emis) {
      if (emi.status === EmiStatus.PAID) continue;

      const loan = await this._iLoanRepository.findById(emi.loan.toString());
      if(!loan) continue;

      const alreadyAppliedToday =
      emi.lastPenaltyAppliedAt &&
      emi.lastPenaltyAppliedAt >= todayStart &&
      emi.lastPenaltyAppliedAt <= todayEnd;

    let updatedPenalty = emi.penalty ?? 0;

    if (!alreadyAppliedToday && updatedPenalty < MAX_PENALTY) {
      updatedPenalty = Math.min(
        updatedPenalty + DAILY_PENALTY,
        MAX_PENALTY
      );

 await this._iEmiRepository.updatePenaltyAndStatus(
        emi._id.toString(),
        updatedPenalty,
        EmiStatus.PENDING,
        new Date() // lastPenaltyAppliedAt
      );
      await this._iNotificationService.createNotification({
        userId: loan.user.toString(),
        emiId: emi._id.toString(),
        title: "EMI Overdue",
        message: `Your EMI of ₹${emi.amount} is overdue. Extra ₹${updatedPenalty} has been charged.`,
        type: NotificationType.EMI_OVERDUE,
      })
     }

     if(updatedPenalty === MAX_PENALTY && !emi.highRiskNotified){
      await this._iNotificationService.createNotification({
        userId: loan.user.toString(),
        emiId: emi._id.toString(),
        title: "Account High Risk",
        message:
          "Your EMI has been overdue for several days. Your account is now at high risk. Please pay immediately.",
        type: NotificationType.EMI_OVERDUE,
     });
     await this._iEmiRepository.markHighRiskNotified(emi._id.toString())

     
  }
  }
}}
