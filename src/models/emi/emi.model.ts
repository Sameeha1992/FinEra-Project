import mongoose, { Schema, Document } from "mongoose";

export interface IEmi extends Document {
  loan: mongoose.Types.ObjectId;

  emiNumber: number;

  amount: number;

  dueDate: Date;

  status: "PENDING" | "PAID";

  penalty?: number;

  paidAt?: Date;

  createdAt: Date;
  updatedAt: Date;
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
      enum: ["PENDING", "PAID"],
      default: "PENDING",
    },

    penalty: {
      type: Number,
      default: 0,
    },

    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEmi>("Emi", EmiSchema);