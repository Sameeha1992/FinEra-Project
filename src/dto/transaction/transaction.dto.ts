import { PaymentStatus } from "@/models/enums/enum";
import mongoose from "mongoose";

export interface TransactionResponseDto {
  id:string
  transactionId: string;
  amount: number;
  paymentStatus:PaymentStatus
  penaltyAmount: number;
  totalAmount: number;
  paidAt: Date;
}

export interface PaginatedTransactionResponseDto {
  transactions: TransactionResponseDto[];
  total: number;
  currentPage: number;
  totalPages: number;
}





export interface UserTransactionResponseDto {
  id: string;
  transactionId: string;
  amount: number;
  paymentStatus: PaymentStatus;
  penaltyAmount: number;
  totalAmount: number;
  paidAt: Date;
}

export interface VendorTransactionResponseDto {
  id: string;
  transactionId: string;
  userName: string;
  userEmail?: string;
  amount: number;
  paymentStatus: PaymentStatus;
  penaltyAmount: number;
  totalAmount: number;
  paidAt: Date;
}

export interface PaginatedUserTransactionResponseDto {
  transactions: UserTransactionResponseDto[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface PaginatedVendorTransactionResponseDto {
  transactions: VendorTransactionResponseDto[];
  total: number;
  currentPage: number;
  totalPages: number;
}