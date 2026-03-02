import { IVendorVerifcationRepository } from "@/interfaces/repositories/admin/vendor.verification.repo.interface";
import { IVendor, VendorModel } from "@/models/vendor/vendor.model";
import { BaseRepository } from "../base_repository";
import { injectable } from "tsyringe";
import { Status } from "@/models/enums/enum";


@injectable()
export class VendorVerifcationRepository extends BaseRepository<IVendor> implements IVendorVerifcationRepository{
  constructor(){
    super(VendorModel)
  }
   async getAllVendor(page: number, limit: number): Promise<{ vendors: IVendor[]; total: number; }> {
       
    const skip =(page-1) *limit;
    const vendors = await VendorModel.find()
    .select("vendorId vendorName email status accountStatus createdAt")
    .skip(skip)
    .limit(limit)
    .sort({createdAt:-1});

    const total = await VendorModel.countDocuments();

    return {vendors,total}
   }

   async findByVendorId(vendorId: string): Promise<IVendor | null> {
     return await this.findOne({vendorId})
   }

   async updateVendorStatus(vendorId: string, status: Status): Promise<IVendor | null> {
     return await VendorModel.findOneAndUpdate({vendorId},{status},{new:true})
   }
}