import { VendorProfileResponseDTO } from "@/dto/vendorDto/vendor.profile.dto";
import { IVendor } from "@/models/vendor/vendor.model";

export class vendorProfileMapper{
    static toResponse(vendor:IVendor):VendorProfileResponseDTO{
        return {
            name:vendor.vendorName,
            vendorId:vendor.vendorId,
            registrationNumber:vendor.registrationNumber,
            email:vendor.email,
            status:vendor.status

        }
    }
}