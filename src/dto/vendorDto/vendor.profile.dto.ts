export interface VendorProfileResponseDTO {
  vendorId: string;
  vendorName: string;
  registrationNumber: string;
  email: string;
  status: string;
  isProfileComplete:boolean;
}

export interface VendorCompleteProfileDto {
  registrationNumber: string;
  licenceNumber: string;
  registrationDoc: Express.Multer.File;
  licenceDoc: Express.Multer.File;
  isProfileComplete: boolean;
}

export interface VendorCompleteProfileResponseDto {
  vendorId: string;
  vendorName: string;
  email: string;
  registrationNumber: string;
  licenceNumber: string;
  registrationDoc: string;
  licenceDoc: string;
}

export interface VendorDocumentsDto {
  registrationDocUrl: string;
  licenceDocUrl: string;
}

export interface VendorCompleteUpdateDto {
  name: string;
  email: string;
  vendorId?: string;

  registrationNumber?: string;
  licenceNumber?: string;
  isProfileComplete?:boolean,

  documents?: VendorDocumentsDto;
}

export interface VendorUpdateProfileDto {
  name?:string;
  vendorId?:string;
  email?:string;
  registrationNumber: string;
  licenceNumber: string;
  isProfileComplete: boolean;
}
