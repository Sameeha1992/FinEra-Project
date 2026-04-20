import { IVendorDashboardRepository } from "@/interfaces/repositories/vendor/vendorDashboard.repository.interface";
import { IVendorDashboardService } from "@/interfaces/services/vendor/vendorDashboard.service.interface";
import { injectable, inject } from "tsyringe";
import { VendorDashboardDto, VendorDashboardExportDto, VendorReportFilterDto } from "@/dto/vendorDto/vendorDashboard.dto";
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

    async getExportData(vendorId: string,filters:VendorReportFilterDto): Promise<VendorDashboardExportDto[]> {
        const data= await this.dashboardRepository.getExportData(vendorId,filters);
        return data ?? []
    }
}
