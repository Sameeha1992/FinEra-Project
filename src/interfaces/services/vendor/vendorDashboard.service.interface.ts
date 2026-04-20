import { VendorDashboardDto, VendorDashboardExportDto, VendorReportFilterDto } from "@/dto/vendorDto/vendorDashboard.dto";

export interface IVendorDashboardService {
    getDashboardData(vendorId: string): Promise<VendorDashboardDto>;
    getExportData(vendorId: string,filters:VendorReportFilterDto): Promise<VendorDashboardExportDto[]> 
}
