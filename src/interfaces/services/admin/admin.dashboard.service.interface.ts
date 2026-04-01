import { AdminDashboardDto } from "@/dto/admin/admin.dashboard.dto";

export interface IAdminDashboardService{
    getDashboardData():Promise<AdminDashboardDto>
}