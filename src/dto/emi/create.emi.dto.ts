import mongoose from "mongoose";

export interface CreateEmiDTO {
  loan: mongoose.Types.ObjectId;
  emiNumber: number;
  amount: number;
  dueDate: Date;
  status: "PENDING" | "PAID";
  penalty?: number;
  paidAt?: Date;
}


export interface EmiListingLoans{
  loan:string,
  emiNumber:number,
  amount:number,
  dueDate:Date,
  status:"PENDING" | "PAID",
  penalty?:number,
  paidAt?:Date

}