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

export type VendorDashboardDto = VendorDashboardData;
