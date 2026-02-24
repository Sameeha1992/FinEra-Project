import { IVendor } from "../../../models/vendor/vendor.model";
import { IBaseRepository } from "../baseRepository.interface";

export interface IVendorRepository extends IBaseRepository<IVendor>{
   findByEmail(email:string):Promise<IVendor |null>
   updateVendorPassword(email:string,password:string):Promise<IVendor|null>
} 