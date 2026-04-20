import { LoanType, PaymentStatus } from "@/models/enums/enum";

export interface VendorDashboardData {
  cards: {
    pendingApplications: number;
    overdueLoans: number;
    approvedApplications: number;
    totalApplications: number;
    totalActiveLoans: number;
    repaymentsThisMonth: number;
    totalLoanProducts: number;
    outstandingPenalty: number;
  };
  applicationStatusOverview: { label: string; value: number }[];
  loanTypeDistribution: { label: string; value: number }[];
  monthlyApplicationTrend: {
    month: string;
    approved: number;
    rejected: number;
    pending: number;
  }[];
}


//Dashboard Data:-
export interface MonthlyApplicationTrendDto {
  _id: {
    year: number;
    month: number;
  };
  approved: number;
  rejected: number;
  pending: number;
}


//Export Data in Dashboard:-

export interface VendorDashboardExportDto {
  userName: string;
  loanAmount:number;
  paymentStatus:PaymentStatus
  userEmail: string;
  loanType: LoanType;
  productName: string;
  interestRate: number;
  emiNumber: number;
  emiAmount: number;
  penaltyPaid: number;
  totalPaid: number;
  paidAt: Date;
  transactionId: string;
}

export interface VendorReportFilterDto {
  date?:string
  startDate?: string;
  endDate?: string;
  month?: number;
  year?: number;
  userId?: string;
  loanType?: string;
  transactionId?: string;
}


export type VendorDashboardDto = VendorDashboardData;
