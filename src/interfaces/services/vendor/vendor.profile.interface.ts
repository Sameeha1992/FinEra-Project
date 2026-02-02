import { VendorProfileResponseDTO } from "@/dto/vendorDto/vendor.profile.dto";

export interface IVendorProfileService{
    getProfile(venodrId:string):Promise<VendorProfileResponseDTO>
}