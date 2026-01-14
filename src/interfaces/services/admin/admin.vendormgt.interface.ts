import { UserVendorResponseDto } from "@/dto/admin/adminvendorMgtDto";
import { PaginatedResult, PaginationQuery } from "@/interfaces/shared/pagination.interface";
import { IUser } from "@/models/user/user.model";
import { IVendor } from "@/models/vendor/vendor.model";

export interface IAdminVendorMgtService{
getAllVendors(query:PaginationQuery & {role: "vendor" |"user"}):Promise<PaginatedResult<UserVendorResponseDto>>

updateStatus(id:string,role:"vendor"|"user",status:"active" |"blocked"):Promise<IVendor |IUser |null>
}