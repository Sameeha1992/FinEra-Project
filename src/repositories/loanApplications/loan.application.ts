import { ILoanApplicationRepository } from "@/interfaces/repositories/loanApplication/loan.application.interface";
import LoanApplication, {
  ILoanApplication,
} from "@/models/applications/application.model";
import {injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import { LoanApplicationStatus, LoanType } from "@/models/enums/enum";

@injectable()
export class LoanApplicationRepository
  extends BaseRepository<ILoanApplication>
  implements ILoanApplicationRepository
{
  constructor() {
    super(LoanApplication);
  }

  async existingActiveLoans(
    userId: string,
    vendorId: string,
    loanType: LoanType,
  ): Promise<boolean> {
    const loan = await LoanApplication.findOne({
      userId,
      loanType,
      vendorId,
      status: { $in: ["PENDING", "APPROVED"] },
    });
    return !!loan;
  }

  async countLoanApplications(): Promise<number> {
    return await LoanApplication.countDocuments();
  }

  async countApprovedLoans(): Promise<number> {
    return await LoanApplication.countDocuments({
      status: LoanApplicationStatus.APPROVED,
    });
  }

  async countPendingLoans(): Promise<number> {
    return await LoanApplication.countDocuments({
      status: LoanApplicationStatus.PENDING,
    });
  }

  async countRejectedLoans(): Promise<number> {
    return await LoanApplication.countDocuments({
      status: LoanApplicationStatus.REJECTED,
    });
  }
}
