import { ILoanApplication } from "@/models/applications/application.model";
import { IBaseRepository } from "../baseRepository.interface";
import { LoanType } from "@/models/enums/enum";

export interface ILoanApplicationRepository extends IBaseRepository<ILoanApplication> {
  existingActiveLoans(
    userId: string,
    vendorId: string,
    loanType: LoanType,
  ): Promise<boolean>;
  countLoanApplications(): Promise<number>;
  countApprovedLoans(): Promise<number>;
  countPendingLoans(): Promise<number>;
  countRejectedLoans(): Promise<number>;
}
