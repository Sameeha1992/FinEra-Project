import { EmiStatus } from "@/models/enums/enum";
import mongoose from "mongoose";

export interface CreateEmiDTO {
  loan: mongoose.Types.ObjectId;
  emiNumber: number;
  amount: number;
  dueDate: Date;
  status: EmiStatus;
  penalty?: number;
  paidAt?: Date;
}

export interface EmiListingLoans {
  emiId: string;
  loan: string;
  emiNumber: number;
  amount: number;
  dueDate: Date;
  status: EmiStatus;
  penalty?: number;
  totalAmount?: number;
  paidAt?: Date;
}
