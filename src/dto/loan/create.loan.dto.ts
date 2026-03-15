import mongoose from "mongoose";

export interface CreateLoanDTO {
  loanId: string;
  applicationId:mongoose.Types.ObjectId;

  user: mongoose.Types.ObjectId;

  loanProduct: mongoose.Types.ObjectId;

  amount: number;

  interestRate: number;

  duePenalty: number;

  tenure: number;

  remainingAmount: number;

  status: "APPROVED";

  startDate: Date;

  endDate?: Date;
}