export interface VendorProfileResponseDTO {
  vendorId: string;
  name: string;
  registrationNumber: string;
  email: string;
  status: string;
  isProfileComplete:boolean;
}

export interface VendorCompleteProfileDto {
  registrationNumber: string;
  licenceNumber: string;
  registrationDoc: Express.Multer.File;
  licence_Doc: Express.Multer.File;
  isProfileComplete: boolean;
}

export interface VendorCompleteProfileResponseDto {
  vendorId: string;
  vendorName: string;
  email: string;
  registrationNumber: string;
  licenceNumber: string;
  registrationDoc: string;
  licence_Doc: string;
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
