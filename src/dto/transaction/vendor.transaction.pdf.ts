import { PaymentStatus, LoanType } from "@/models/enums/enum";

export interface VendorTransactionPdfItemDto {
  transactionId: string;
  userName: string;

  loanType: LoanType;
  loanAmount: number;
  interestRate: number;

  penaltyAmount: number;
  totalPaidAmount: number;

  paymentStatus: PaymentStatus;
  paidAt: Date;
}


export interface PopulatedUser {
  _id: string;
  fullName?: string;
  name?: string;
}

export interface PopulatedLoan {
  _id: string;
  loanType: string;
  amount: number;
  interestRate: number;
}

export interface VendorTransactionReportEntity {
  transactionId: string;
  userId: PopulatedUser;
  loanId: PopulatedLoan;
  penaltyAmount?: number;
  totalAmount: number;
  paymentStatus: string;
  paidAt: Date;
}