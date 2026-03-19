import { IEmi } from "@/models/emi/emi.model";
import { IBaseRepository } from "../baseRepository.interface";
import { CreateEmiDTO } from "@/dto/emi/create.emi.dto";
import { EmiStatus } from "@/models/enums/enum";

export interface IEmiRepository extends IBaseRepository<IEmi> {
  createManyEmi(emiData: CreateEmiDTO[]): Promise<IEmi[]>;
  findByLoanId(loanId: string): Promise<IEmi[]>;
  updateEmiStatus(emiId: string, status: EmiStatus): Promise<IEmi | null>;
  findNextEmi(loan: string, currentEmiNumber: number): Promise<IEmi | null>;
  findEmiById(emiId: string): Promise<IEmi | null>;
  markEmiAsPaid(emiId: string, paidAt: Date): Promise<IEmi | null>;
  updatePenaltyAndStatus(emiId: string,penalty: number,status: EmiStatus, lastPenaltyAppliedAt:Date): Promise<IEmi | null>;

  //For notifications:-

  findEmiByDueDate(startDate:Date,endDate:Date):Promise<IEmi[]>
  findOverDueEmis(currentDate:Date):Promise<IEmi[]>
  markHighRiskNotified(emiId: string): Promise<IEmi | null>
  
}
