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
      console.log("========== EMI REPOSITORY DEBUG ==========");
      console.log("loanId received in repo:", loan);

      const emis = await Emi.find({ loan }).sort({ emiNumber: 1 });

      console.log("EMI documents from DB:", emis);
      console.log("EMI count:", emis.length);

      console.log("========== EMI REPOSITORY END ==========");

      return emis;
    } catch (error) {
      console.log("========== EMI REPOSITORY ERROR ==========");
      console.log("repository error:", error);
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
  async updatePenaltyAndStatus(
    emiId: string,
    penalty: number,
    status: EmiStatus,
    lastPenaltyAppliedAt:Date
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
    return await Emi.find({dueDate:{$gte:startDate,$lte:endDate},status:{$ne:EmiStatus.PAID}})
  }

  async findOverDueEmis(currentDate: Date): Promise<IEmi[]> {
    return await Emi.find({dueDate:{$lt:currentDate},status:{$ne:EmiStatus.PAID}})
  }

async markHighRiskNotified(emiId: string): Promise<IEmi | null>{
  return await Emi.findByIdAndUpdate(emiId,{$set:{highRiskNotified:true}},{new:true})
}
}
