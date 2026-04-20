import mongoose from "mongoose";

export type VendorTransactionWithUser = {
  _id: mongoose.Types.ObjectId;
  transactionId: string;
  amount: number;
  paymentStatus: string;
  totalAmount: number;
  penaltyAmount: number;
  paidAt?: Date;
  createdAt: Date;
  userId?: mongoose.Types.ObjectId;
  vendorId?: mongoose.Types.ObjectId;
  loanId?: mongoose.Types.ObjectId;
  emiId?: mongoose.Types.ObjectId;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
};