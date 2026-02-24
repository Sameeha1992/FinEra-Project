import { VendorCompleteProfileDto, VendorCompleteProfileResponseDto, VendorCompleteUpdateDto, VendorProfileResponseDTO, VendorUpdateProfileDto } from "@/dto/vendorDto/vendor.profile.dto";

export interface IVendorProfileService{
    getProfile(venodrId:string):Promise<VendorProfileResponseDTO>
    completeProfile(vendorId:string,dto:VendorCompleteProfileDto,files:{registrationDoc?:Express.Multer.File,licenceDoc?:Express.Multer.File}):Promise<VendorCompleteProfileResponseDto>
    getCompleteProfile(vendorid:string):Promise<VendorCompleteUpdateDto>
    updateCompleteProfile(vendorid:string,dto:VendorUpdateProfileDto,files?:{registrationDoc?: Express.Multer.File,licenceDoc?: Express.Multer.File;}):Promise<VendorCompleteProfileResponseDto>
    
}