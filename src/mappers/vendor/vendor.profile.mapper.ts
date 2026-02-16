import { VendorCompleteProfileDto, VendorCompleteProfileResponseDto, VendorProfileResponseDTO } from "@/dto/vendorDto/vendor.profile.dto";
import { IVendor } from "@/models/vendor/vendor.model";

export class vendorProfileMapper{
    static toResponse(vendor:IVendor):VendorProfileResponseDTO{
        return {
            name:vendor.vendorName,
            vendorId:vendor.vendorId,
            registrationNumber:vendor.registrationNumber,
            email:vendor.email,
            status:vendor.status,
            isProfileComplete:vendor.isProfileComplete

        }
    }
}


export class CompleteVendorProfileMapper{
    static toEntity(dto:VendorCompleteProfileDto,fileUrls:{registrationDoc?:string,licenceDoc?:string}):Partial<IVendor>{
        return {
            registrationNumber:dto.registrationNumber,
            licenceNumber:dto.licenceNumber,
            registrationDoc:fileUrls.registrationDoc,
            licence_Doc:fileUrls.licenceDoc
        }
    }

    static toResponse(vendor:IVendor):VendorCompleteProfileResponseDto{
        return{
            vendorName:vendor.vendorName,
            vendorId:vendor.vendorId,
            email:vendor.email,
            registrationNumber:vendor.registrationNumber ?? "",
            licenceNumber:vendor.licenceNumber ?? "",

            registrationDoc:vendor.registrationDoc ?? "",
            licence_Doc:vendor.licence_Doc??""
            
        }
    }
}