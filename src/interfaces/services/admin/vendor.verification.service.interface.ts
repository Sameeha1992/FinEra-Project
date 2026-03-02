import { UpdateVendorStatusDto, VendorDetailDTO, VendorVerificationListDto } from "@/dto/admin/vendor.verification.dto";
import { Status } from "@/models/enums/enum";

export interface IVendorVerificationService{
    getVendorList(page:number,limit:number):Promise<{vendors:VendorVerificationListDto[],total:number,currentPages:number;totalPages:number}>
    getVendorDetails(vendorId:string):Promise<VendorDetailDTO>
    updateVendorStatus(vendorId:string,status:Status):Promise<UpdateVendorStatusDto>
}