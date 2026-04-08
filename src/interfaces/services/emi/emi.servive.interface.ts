import { CreateEmiDTO, EmiListingLoans } from "@/dto/emi/create.emi.dto";
import { GenerateEmiScheduleInput } from "@/dto/emi/emi.calculation.dto";
import { EmiListingPageDto } from "@/dto/emi/emi.statistic.dto";

export interface IEmiService {
  getEmisByLoanId(loanId: string, userId: string): Promise<EmiListingPageDto>;
  generateEmiSchedule(data: GenerateEmiScheduleInput): Promise<CreateEmiDTO[]>;
  getEmiDetails(emiId: string, userId: string): Promise<EmiListingLoans>;
}
