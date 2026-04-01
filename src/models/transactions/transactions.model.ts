import mongoose, { Schema, Document } from "mongoose";
import { PaymentStatus } from "../enums/enum";

export interface ITransaction extends Document {
  _id: string;
  transactionId:string,
  userId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  loanId: mongoose.Types.ObjectId;
  emiId: mongoose.Types.ObjectId;

  amount: number;
  penaltyAmount?: number;
  paymentStatus: PaymentStatus;
  totalAmount: number;

  paidAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    loanId: {
      type: Schema.Types.ObjectId,
      ref: "Loan",
      required: true,
    },

    emiId: {
      type: Schema.Types.ObjectId,
      ref: "Emi",
      required: true,
    },
    transactionId:{
      type:String,
      unique:true,
      required:true
    },

    amount: {
      type: Number,
      required: true,
    },
    
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default:PaymentStatus.PENDING,
      required: true,
    },

    penaltyAmount: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paidAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
