import mongoose, { Schema, Document } from "mongoose";
import { EmiStatus } from "../enums/enum";

export interface IEmi extends Document {
  _id:mongoose.Types.ObjectId;
  loan: mongoose.Types.ObjectId;

  emiNumber: number;

  amount: number;

  dueDate: Date;

  status: EmiStatus;

  penalty?: number;

  paidAt?: Date;

  lastPenaltyAppliedAt?: Date;
  
highRiskNotified?: boolean;

  createdAt: Date;
  updatedAt: Date;

  paymentLockedAt?: Date;
}

const EmiSchema = new Schema<IEmi>(
  {
    loan: {
      type: Schema.Types.ObjectId,
      ref: "Loan",
      required: true,
    },

    emiNumber: {
      type: Number,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum:Object.values(EmiStatus),
      default: EmiStatus.UPCOMING,
    },

    penalty: {
      type: Number,
      default: 0,
    },

    paidAt: {
      type: Date,
    },
    paymentLockedAt:{
        type:Date
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEmi>("Emi", EmiSchema);