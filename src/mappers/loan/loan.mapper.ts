import { CreateLoanDTO } from "@/dto/loan/create.loan.dto";
import mongoose from "mongoose";

interface LoanApplicationData {
  user: mongoose.Types.ObjectId;
  loanProduct: mongoose.Types.ObjectId;
  loanAmount: number;
  loanTenure: number;
  applicationId: mongoose.Types.ObjectId;
}

interface LoanProductData {
  interestRate: number;
  duePenalty: number;
  processingFee: number;
  isProcessingFeePaid: boolean;
}

export class CreateLoanMappers {
  static toEntity(
    application: LoanApplicationData,
    loanProduct: LoanProductData,
  ): CreateLoanDTO {
    return {
      loanId: `LOAN-${Date.now()}`,
      applicationId: application.applicationId,
      user: application.user,
      loanProduct: application.loanProduct,
      amount: application.loanAmount,
      interestRate: loanProduct.interestRate,
      duePenalty: loanProduct.duePenalty,
      tenure: application.loanTenure,
      status: "APPROVED",
      remainingAmount: application.loanAmount,
      startDate: new Date(),
    };
  }
}
