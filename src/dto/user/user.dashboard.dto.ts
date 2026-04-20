export interface DashboardSummaryDto {
  totalLoans: number;
  activeLoans: number;
  totalRemainingDues: number;
  rejectedApplications: number;
}

export interface ActiveLoanCardDto {
  loanId: string;
  bankName: string;
  loanType: string;
  loanAmount: number;
  remainingDueAmount: number;
  nextEmiAmount: number | null;
  nextEmiDate: Date | null;
  completionPercentage: number;
  expectedDueDate: Date | null;
}

export interface RejectedApplicationDto {
  applicationId: string;
  bankName: string;
  loanType: string;
  requestedAmount: number;
  rejectionReason: string;
  status: string;
}

export interface UserDashboardDto {
  summary: DashboardSummaryDto;
  activeLoanCards: ActiveLoanCardDto[];
  rejectedApplications: RejectedApplicationDto[];
}
