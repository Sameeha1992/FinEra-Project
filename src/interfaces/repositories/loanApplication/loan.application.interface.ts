import { ILoanApplication } from "@/models/applications/application.model";
import { IBaseRepository } from "../baseRepository.interface";
import { LoanType } from "@/models/enums/enum";

export interface ILoanApplicationRepository extends IBaseRepository<ILoanApplication>{
    existingActiveLoans(userId:string,loanType:LoanType):Promise<boolean>
}