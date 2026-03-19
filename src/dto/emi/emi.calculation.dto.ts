import mongoose from "mongoose";

export interface GenerateEmiScheduleInput {
  loanId: mongoose.Types.ObjectId;
  loanAmount: number;
  tenure: number;
  interestRate: number;
  startDate?: Date;
}
