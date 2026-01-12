 import { IVendor, VendorModel } from "../../models/vendor/vendor.model"
import { IBaseRepository } from "../../interfaces/repositories/baseRepository.interface"
import { BaseRepository } from "../base_repository"
import { IVendorAuthRepository } from "../../interfaces/repositories/vendor/vendor.auth"
import { VendorResponseDto } from "../../dto/vendorDto/vendor.auth.dto"
 
 
export class vendorAuthRepository extends BaseRepository<IVendor> implements IVendorAuthRepository{
  constructor(){
    super(VendorModel)

  }
    async findByEmail(email: string): Promise<IVendor|null> {
        return await VendorModel.findOne({contact_email:email})
    }
    async updateVendorPassword(email:string,hashPassword:string){
      return await VendorModel.findOneAndUpdate({contact_email:email},{password:hashPassword},{new:true})
    }
}