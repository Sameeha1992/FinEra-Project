import { IVendorDashboardRepository } from "@/interfaces/repositories/vendor/vendorDashboard.repository.interface";
import { IVendorDashboardService } from "@/interfaces/services/vendor/vendorDashboard.service.interface";
import { injectable, inject } from "tsyringe";
import { VendorDashboardDto } from "@/dto/vendorDto/vendorDashboard.dto";
import { VendorDashboardMapper } from "@/mappers/vendor/vendorDashboard.mapper";

@injectable()
export class VendorDashboardService implements IVendorDashboardService {
    constructor(
        @inject("IVendorDashboardRepository")
        private readonly dashboardRepository: IVendorDashboardRepository
    ) {}

    async getDashboardData(vendorId: string): Promise<VendorDashboardDto> {
        const [
            appCounts,
            productCount,
            activeLoanCount,
            overdueLoansCount,
            repaymentsSum,
            penaltySum,
            appTrend,
            typeDistribution
        ] = await Promise.all([
            this.dashboardRepository.getLoanApplicationCounts(vendorId),
            this.dashboardRepository.getLoanProductCount(vendorId),
            this.dashboardRepository.getActiveLoanCount(vendorId),
            this.dashboardRepository.getOverdueLoansCount(vendorId),
            this.dashboardRepository.getRepaymentsSumThisMonth(vendorId),
            this.dashboardRepository.getOutstandingPenaltySum(vendorId),
            this.dashboardRepository.getMonthlyApplicationTrend(vendorId),
            this.dashboardRepository.getLoanTypeDistribution(vendorId)
        ]);

        return VendorDashboardMapper.toDto({
            appCounts,
            overdueLoans: overdueLoansCount,
            activeLoans: activeLoanCount,
            repaymentsSum,
            productCount,
            penaltySum,
            appTrend,
            typeDistribution
        });
    }

    async getExportCSVPayload(vendorId: string): Promise<string> {
        const data = await this.dashboardRepository.getExportData(vendorId);
        
        if (!data || data.length === 0) {
            return "No transactions found";
        }

        const headers = [
            "Transaction ID",
            "Customer Name",
            "Email",
            "Loan Type",
            "Product",
            "EMI Number",
            "EMI Amount",
            "Interest Rate",
            "Penalty Paid",
            "Total Paid",
            "Paid Date"
        ];

        const rows = data.map(item => [
            item.transactionId,
            `"${item.userName}"`,
            item.userEmail,
            item.loanType,
            `"${item.productName}"`,
            item.emiNumber,
            item.emiAmount,
            `${item.interestRate}%`,
            item.penaltyPaid,
            item.totalPaid,
            new Date(item.paidAt).toLocaleDateString()
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        return csvContent;
    }
}
