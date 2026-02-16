import mongoose, { Schema, Document } from "mongoose";

export interface ILoan extends Document {
  loanId: string;

  user: mongoose.Types.ObjectId;
  loanProduct: mongoose.Types.ObjectId;

  amount: number;
  interestRate: number;   // copied from product
  duePenalty: number;     // copied from product
  tenure: number;         // months

  status: "PENDING" | "APPROVED" | "REJECTED" | "CLOSED";

  remainingAmount: number;

  startDate?: Date;
  endDate?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const LoanSchema = new Schema<ILoan>(
  {
    loanId: {
      type: String,
      required: true,
      unique: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    loanProduct: {
      type: Schema.Types.ObjectId,
      ref: "LoanProduct",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    interestRate: {
      type: Number,
      required: true,
    },

    duePenalty: {
      type: Number,
      required: true,
    },

    tenure: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "CLOSED"],
      default: "PENDING",
    },

    remainingAmount: {
      type: Number,
      required: true,
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ILoan>("Loan", LoanSchema);