import {
  VendorRegisterDto,
  VendorResponseDto,
} from "../../dto/vendorDto/vendor.auth.dto";
import { Role, Status } from "../../models/enums/enum";
import { IVendor } from "../../models/vendor/vendor.model";
import { randomUUID } from "crypto"; // Built-in Node.js

type VendorRegisterEntity = {
  vendorId: string;
  vendorName: string;
  email: string;
  registrationNumber: string;
  role: Role;
  password: string;
  status: Status;
};

export class vendorRegisterMapper {
  static toResponse(vendor: IVendor): VendorResponseDto {
    return {
      name: vendor.vendorName,
      email: vendor.email,
      registerNumber: vendor.registrationNumber,
      role: Role.Vendor,
      createdAt: vendor.createdAt.toISOString(),
    };
  }

  static toEntity(
    dto: VendorRegisterDto,
    passwordHash: string,
  ): VendorRegisterEntity {
    if (!dto.name || !dto.email || !dto.registerNumber) {
      throw new Error("Missing required vendor registration fields");
    }
    return {
      vendorId: `VEND-${randomUUID().slice(0, 8).toUpperCase()}`, // AUTO
      vendorName: dto.name,
      email: dto.email,
      registrationNumber: dto.registerNumber,
      role: Role.Vendor,
      password: passwordHash,
      status: Status.Not_Verified,
    };
  }
}
