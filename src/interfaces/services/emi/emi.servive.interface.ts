import { CreateEmiDTO, EmiListingLoans } from "@/dto/emi/create.emi.dto";
import { GenerateEmiScheduleInput } from "@/dto/emi/emi.calculation.dto";

export interface IEmiService {
  getEmisByLoanId(loanId: string, userId: string): Promise<EmiListingLoans[]>;
  generateEmiSchedule(data: GenerateEmiScheduleInput): Promise<CreateEmiDTO[]>;
  getEmiDetails(emiId: string, userId: string): Promise<EmiListingLoans>;
}
