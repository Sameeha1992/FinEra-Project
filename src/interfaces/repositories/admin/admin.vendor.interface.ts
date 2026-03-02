import { IVendor } from "@/models/vendor/vendor.model";
import { IBaseRepository } from "../baseRepository.interface";
import { PaginatedResult, PaginationQuery } from "@/interfaces/shared/pagination.interface";
import { IUser } from "@/models/user/user.model";
import { AccountStatus } from "@/models/enums/enum";

export interface IAdminVendorMgtRepo extends IBaseRepository<IVendor |IUser>{
    
    findAllVendors(query:PaginationQuery):Promise<PaginatedResult<IVendor | IUser>>
    updateStatus(id:string,role:"vendor"|"user",accountStatus:AccountStatus):Promise<IVendor|IUser|null>
}