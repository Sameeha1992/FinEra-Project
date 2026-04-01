import { VendorDashboardDto } from "@/dto/vendorDto/vendorDashboard.dto";

export class VendorDashboardMapper {
  static toDto(data: {
    appCounts: { total: number; pending: number; approved: number; rejected: number };
    overdueLoans: number;
    activeLoans: number;
    repaymentsSum: number;
    productCount: number;
    penaltySum: number;
    appTrend: any[];
    typeDistribution: { label: string; value: number }[];
  }): VendorDashboardDto {
    const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Create map for trend data
    const trendMap = new Map();
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const month = d.getMonth() + 1; // 1-indexed for comparison with mongo
      const monthLabel = monthsShort[d.getMonth()];
      const key = `${year}-${month}`;
      last6Months.push({ key, label: monthLabel });
      trendMap.set(key, { month: monthLabel, approved: 0, rejected: 0, pending: 0 });
    }

    data.appTrend.forEach(item => {
      const key = `${item._id.year}-${item._id.month}`;
      if (trendMap.has(key)) {
        trendMap.set(key, {
          month: trendMap.get(key).month,
          approved: item.approved,
          rejected: item.rejected,
          pending: item.pending
        });
      }
    });

    return {
      cards: {
        pendingApplications: data.appCounts.pending,
        overdueLoans: data.overdueLoans,
        approvedApplications: data.appCounts.approved,
        totalApplications: data.appCounts.total,
        totalActiveLoans: data.activeLoans,
        repaymentsThisMonth: data.repaymentsSum,
        totalLoanProducts: data.productCount,
        outstandingPenalty: data.penaltySum,
      },
      applicationStatusOverview: [
        { label: "Approved", value: data.appCounts.approved },
        { label: "Pending", value: data.appCounts.pending },
        { label: "Rejected", value: data.appCounts.rejected }
      ],
      loanTypeDistribution: data.typeDistribution,
      monthlyApplicationTrend: last6Months.map(m => trendMap.get(m.key))
    };
  }
}
