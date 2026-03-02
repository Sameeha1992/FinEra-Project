import { Status } from "@/models/enums/enum";
import { IVendor } from "@/models/vendor/vendor.model";

export interface IVendorVerifcationRepository{
    getAllVendor(page:number,limit:number):Promise<{vendors:IVendor[],total:number}>
    findByVendorId(vendorId:string):Promise<IVendor |null>;
    updateVendorStatus(vendorId:string,status:Status):Promise<IVendor |null>
}