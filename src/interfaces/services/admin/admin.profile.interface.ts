import { AdminProfileDto } from "@/dto/admin/admin.profile.dto";

export interface IAdminProfileService{
    getAdminProfile(adminId:string):Promise<AdminProfileDto>
}