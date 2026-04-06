import { LoanType } from "@/models/enums/enum";

export interface IVendorDashboardRepository {
  getLoanApplicationCounts(vendorId: string): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  }>;

  getLoanProductCount(vendorId: string): Promise<number>;

  getActiveLoanCount(vendorId: string): Promise<number>;

  getOverdueLoansCount(vendorId: string): Promise<number>;

  getRepaymentsSumThisMonth(vendorId: string): Promise<number>;

  getOutstandingPenaltySum(vendorId: string): Promise<number>;

  getMonthlyApplicationTrend(vendorId: string): Promise<any[]>;

  getExportData(vendorId: string): Promise<any[]>;

  getLoanTypeDistribution(
    vendorId: string,
  ): Promise<{ label: string; value: number }[]>;
}
