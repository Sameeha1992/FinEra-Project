import {
  VendorCompleteProfileDto,
  VendorCompleteProfileResponseDto,
  VendorProfileResponseDTO,
  VendorUpdateProfileDto,
} from "@/dto/vendorDto/vendor.profile.dto";
import { IVendor } from "@/models/vendor/vendor.model";

export class vendorProfileMapper {
  static toResponse(vendor: IVendor): VendorProfileResponseDTO {
    return {
      vendorName: vendor.vendorName,
      vendorId: vendor.vendorId,
      registrationNumber: vendor.registrationNumber,
      email: vendor.email,
      status: vendor.status,
      isProfileComplete: vendor.isProfileComplete,
    };
  }
}

export class CompleteVendorProfileMapper {
  static toEntity(
    dto: VendorCompleteProfileDto,
    fileUrls: { registrationDoc?: string; licenceDoc?: string },
  ): Partial<IVendor> {
    return {
      registrationNumber: dto.registrationNumber,
      licenceNumber: dto.licenceNumber,
      registrationDoc: fileUrls.registrationDoc,
      licenceDoc: fileUrls.licenceDoc,
    };
  }

  static toResponse(vendor: IVendor): VendorCompleteProfileResponseDto {
    return {
      vendorName: vendor.vendorName,
      vendorId: vendor.vendorId,
      email: vendor.email,
      registrationNumber: vendor.registrationNumber ?? "",
      licenceNumber: vendor.licenceNumber ?? "",

      registrationDoc: vendor.registrationDoc ?? "",
      licenceDoc: vendor.licenceDoc ?? "",
    };
  }

  static toUpdateEntity(dto: VendorUpdateProfileDto): Partial<IVendor> {
    return {
      vendorName: dto.name,
      email: dto.email,
      registrationNumber: dto.registrationNumber,
      licenceNumber: dto.licenceNumber,
      isProfileComplete: dto.isProfileComplete,
    };
  }
}
