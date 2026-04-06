import Emi, { IEmi } from "@/models/emi/emi.model";
import { BaseRepository } from "../base_repository";
import { IEmiRepository } from "@/interfaces/repositories/emi/emi.repository.interface";
import { CreateEmiDTO } from "@/dto/emi/create.emi.dto";
import { injectable } from "tsyringe";
import { EmiStatus } from "@/models/enums/enum";

@injectable()
export class EmiRepository
  extends BaseRepository<IEmi>
  implements IEmiRepository
{
  constructor() {
    super(Emi);
  }

  async createManyEmi(emiData: CreateEmiDTO[]): Promise<IEmi[]> {
    return await Emi.insertMany(emiData);
  }

  async findByLoanId(loan: string): Promise<IEmi[]> {
    try {

      const emis = await Emi.find({ loan }).sort({ emiNumber: 1 });



      return emis;
    } catch (error) {
      console.log("Error for emi finding",error)
      throw error;
    }
  }

  async updateEmiStatus(
    emiId: string,
    status: EmiStatus,
  ): Promise<IEmi | null> {
    return await Emi.findByIdAndUpdate(
      emiId,
      { $set: { status } },
      { new: true },
    );
  }

  async findNextEmi(
    loan: string,
    currentEmiNumber: number,
  ): Promise<IEmi | null> {
    return await Emi.findOne({
      loan,
      emiNumber: { $gt: currentEmiNumber },
      status: EmiStatus.UPCOMING,
    }).sort({ emiNumber: 1 });
  }

  async findEmiById(emiId: string): Promise<IEmi | null> {
    return await Emi.findById(emiId);
  }

  async markEmiAsPaid(emiId: string, paidAt: Date): Promise<IEmi | null> {
    return await Emi.findByIdAndUpdate(
      emiId,
      {
        $set: {
          status: EmiStatus.PAID,
          paidAt,
        },
      },
      { new: true },
    );
  }

  async lockEmiForPayment(emiId: string): Promise<IEmi | null> {
    const LOCK_TIMEOUT_MS = 1 * 60 * 1000;
    const expiryTime = new Date(Date.now() - LOCK_TIMEOUT_MS);

    return await Emi.findOneAndUpdate(
      {
        _id: emiId,
        $or: [
        //Normal state
          { status: { $nin: [EmiStatus.PAID, EmiStatus.PAYMENT_IN_PROGRESS] } },
          // Case 2: Expired lock
          {
            status: EmiStatus.PAYMENT_IN_PROGRESS,
            $or: [
              { paymentLockedAt: { $lt: expiryTime } },
              { paymentLockedAt: { $exists: false } },
            ],
          },
        ],
      },
      {
        $set: {
          status: EmiStatus.PAYMENT_IN_PROGRESS,
          paymentLockedAt: new Date(),
        },
      },
      { new: true },
    );
  }
  async updatePenaltyAndStatus(
    emiId: string,
    penalty: number,
    status: EmiStatus,
    lastPenaltyAppliedAt: Date,
  ): Promise<IEmi | null> {
    return await Emi.findByIdAndUpdate(
      emiId,
      {
        $set: {
          penalty,
          status,
          lastPenaltyAppliedAt,
        },
      },
      { new: true },
    );
  }

  async findEmiByDueDate(startDate: Date, endDate: Date): Promise<IEmi[]> {
    return await Emi.find({
      dueDate: { $gte: startDate, $lte: endDate },
      status: { $ne: EmiStatus.PAID },
    });
  }

  async findOverDueEmis(currentDate: Date): Promise<IEmi[]> {
    return await Emi.find({
      dueDate: { $lt: currentDate },
      status: { $ne: EmiStatus.PAID },
    });
  }

  async markHighRiskNotified(emiId: string): Promise<IEmi | null> {
    return await Emi.findByIdAndUpdate(
      emiId,
      { $set: { highRiskNotified: true } },
      { new: true },
    );
  }
}
