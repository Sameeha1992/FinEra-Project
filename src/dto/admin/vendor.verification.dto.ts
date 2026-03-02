import { AccountStatus, Role, Status } from "@/models/enums/enum";

export interface VendorVerificationListDto{
    vendorId:string;
    vendorName:string;
    email:string;
    status:Status;
    accountStatus:AccountStatus,

}


export interface VendorDetailDTO {

  vendorId: string;

  vendorName: string;

  email: string;

  registrationNumber: string;

  licenceNumber?: string;

  registrationDoc?: string;

  licenceDoc?: string;

  status: Status;

  isProfileComplete: boolean;

  isBlocked: boolean;

  role: Role;

  accountStatus: AccountStatus;

  createdAt: Date;

  updatedAt: Date;

  uploadedAt?: Date;

}

export interface UpdateVendorStatusDto{
  vendorId:string,
  status:Status
}