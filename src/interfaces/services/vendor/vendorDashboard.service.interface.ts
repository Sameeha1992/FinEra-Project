import { VendorDashboardDto } from "@/dto/vendorDto/vendorDashboard.dto";

export interface IVendorDashboardService {
    getDashboardData(vendorId: string): Promise<VendorDashboardDto>;
    getExportCSVPayload(vendorId: string): Promise<string>;
}
