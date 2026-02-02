import { IAdminVendorMgtRepo } from "@/interfaces/repositories/admin/admin.vendor.interface";
import { IVendor, VendorModel } from "@/models/vendor/vendor.model";
import { BaseRepository } from "../base_repository";
import { injectable } from "tsyringe";
import {
  PaginatedResult,
  PaginationQuery,
} from "@/interfaces/shared/pagination.interface";
import { IUser, UserModel } from "@/models/user/user.model";

type RoleModel = "vendor" | "user";

@injectable()
export class AdminVendorMgtRepo
  extends BaseRepository<IVendor | IUser>
  implements IAdminVendorMgtRepo
{
  constructor() {
    super(undefined as any);
  }

  async findAllVendors(
    query: PaginationQuery & { role: RoleModel }
  ): Promise<PaginatedResult<IVendor | IUser>> {
    const { page, limit, search, role } = query;
    const skip = (page - 1) * limit;

    if (role === "vendor") {
      const filter: any = { role: "vendor" };

      if (search) {
        filter.$or = [
          { vendorName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { registrationNumber: { $regex: search, $options: "i" } },
        ];
      }

      const [data, total] = await Promise.all([
        VendorModel.find(filter)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        VendorModel.countDocuments(filter),
      ]);

      return { data, total, page, limit };
    }

    // role === "user"

    const filter: any = { role: "user" };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [data, total] = await Promise.all([
      UserModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      UserModel.countDocuments(filter),
    ]);

    return { data, total, page, limit };
  }


  async updateStatus(id: string, role: "vendor" | "user", status: "active" | "blocked"): Promise<IVendor | IUser | null> {
      
     if (role === "vendor") {
      return await VendorModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
    } else {
      return await UserModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
    }
  }
}
