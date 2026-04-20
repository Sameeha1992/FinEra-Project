import { IVendorVerifcationRepository } from "@/interfaces/repositories/admin/vendor.verification.repo.interface";
import { IVendor, VendorModel } from "@/models/vendor/vendor.model";
import { BaseRepository } from "../base_repository";
import { injectable } from "tsyringe";
import { Status } from "@/models/enums/enum";
import { FilterQuery } from "mongoose";

@injectable()
export class VendorVerifcationRepository
  extends BaseRepository<IVendor>
  implements IVendorVerifcationRepository
{
  constructor() {
    super(VendorModel);
  }
  async getAllVendor(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ vendors: IVendor[]; total: number }> {
    const skip = (page - 1) * limit;

    const query: FilterQuery<IVendor> = {};

    if (search && search.trim() !== "") {
      query.$or = [
        { vendorName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { vendorId: { $regex: search, $options: "i" } },
      ];
    }
    const vendors = await VendorModel.find(query)
      .select("vendorId vendorName email status accountStatus createdAt")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await VendorModel.countDocuments();

    return { vendors, total };
  }

  async findByVendorId(vendorId: string): Promise<IVendor | null> {
    return await this.findOne({ vendorId });
  }

  async updateVendorStatus(
    vendorId: string,
    status: Status,
    rejectionReason: string,
  ): Promise<IVendor | null> {
    const updateData: Partial<IVendor> = { status };
    if (status === Status.Rejected) {
      updateData.rejectionReason = rejectionReason;
    } else {
      updateData.rejectionReason = undefined;
    }
    return await VendorModel.findOneAndUpdate({ vendorId }, updateData, {
      new: true,
    });
  }
}
