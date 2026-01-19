import { UserVendorResponseDto} from "@/dto/admin/adminvendorMgtDto";
import { IAdminVendorMgtRepo } from "@/interfaces/repositories/admin/admin.vendor.interface";
import { IAdminVendorMgtService } from "@/interfaces/services/admin/admin.vendormgt.interface";
import {
  PaginatedResult,
  PaginationQuery,
} from "@/interfaces/shared/pagination.interface";
import { VendorMgtMapper } from "@/mappers/admin/vendor.mgt.mapper";
import { IUser } from "@/models/user/user.model";
import { IVendor } from "@/models/vendor/vendor.model";
import { inject, injectable } from "tsyringe";

@injectable()
export class AdminVendorMgtService implements IAdminVendorMgtService {
  constructor(
    @inject("IAdminVendorMgtRepo")
    private readonly _IAdminVendorMgtRepo: IAdminVendorMgtRepo
  ) {}
  async getAllVendors(
    query: PaginationQuery & {role: "vendor" |"user"}
  ): Promise<PaginatedResult<UserVendorResponseDto>> {
    const result = await this._IAdminVendorMgtRepo.findAllVendors(query);
    

    return {
      data: VendorMgtMapper.toResponseList(result.data),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }


  async updateStatus(id: string, role: "vendor" | "user", status: "active" | "blocked"): Promise<IVendor | IUser | null> {
    const updatedRecord = await this._IAdminVendorMgtRepo.updateStatus(id,role,status);
    return updatedRecord
  }
}
