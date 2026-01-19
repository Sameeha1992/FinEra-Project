import { IVendor } from "../../../models/vendor/vendor.model";
import { IBaseRepository } from "../baseRepository.interface";

export interface IVendorAuthRepository extends IBaseRepository<IVendor>{
   findByEmail(email:string):Promise<IVendor |null>
   updateVendorPassword(contact_email:string,password:string):Promise<IVendor|null>
} 