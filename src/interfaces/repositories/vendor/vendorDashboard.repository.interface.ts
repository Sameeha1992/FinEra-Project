import { MonthlyApplicationTrendDto, VendorDashboardExportDto, VendorReportFilterDto } from "@/dto/vendorDto/vendorDashboard.dto";

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

  getMonthlyApplicationTrend(vendorId: string): Promise<MonthlyApplicationTrendDto[]>;

  getExportData(vendorId: string,filters:VendorReportFilterDto): Promise<VendorDashboardExportDto[]>;

  getLoanTypeDistribution(
    vendorId: string,
  ): Promise<{ label: string; value: number }[]>;
}
