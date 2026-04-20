 import { IVendor, VendorModel } from "../../models/vendor/vendor.model"
import { BaseRepository } from "../base_repository"
import { IVendorRepository } from "../../interfaces/repositories/vendor/vendor.auth"
import { Status } from "@/models/enums/enum"
 
 
export class VendorRepository extends BaseRepository<IVendor> implements IVendorRepository{
  constructor(){
    super(VendorModel)

  }
    async findByEmail(email: string): Promise<IVendor|null> {
        return await VendorModel.findOne({email:email})
    }
    async updateVendorPassword(email:string,hashPassword:string){
      return await VendorModel.findOneAndUpdate({email:email},{password:hashPassword},{new:true})
    }

    async countVendors(): Promise<number> {
      return await VendorModel.countDocuments()
    }

    async countVerifiedVendors(): Promise<number> {
      return await VendorModel.countDocuments({status:Status.Verified})
    }

    async countNonVerifiedVendors(): Promise<number> {
      return await VendorModel.countDocuments({status:Status.Not_Verified})
    }

    async countRejectedVendors(): Promise<number> {
      return await VendorModel.countDocuments({status:Status.Rejected})
    }
}