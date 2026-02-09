export interface UserProfileResponseDTO {
  customerId: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  status?: string;
}

export interface UserCompleteProfileDto {
  dob: string;
  job: string;
  income: string;
  gender: "male" | "female" | "other";
  adhaarNumber: string;
  panNumber: string;
  cibilScore: string;
  adhaarDoc: Express.Multer.File;
  panDoc: Express.Multer.File;
  cibilDoc: Express.Multer.File;
  isProfileComplete:boolean;
}

export interface UserCompletedResponseDto {
  name: string;
  customerId: string;
  email: string;
  phone: string;
  status: string;
  dob: string;
  job: string;
  income: string;
  gender: "male" | "female" | "other";
  adhaarNumber: string;
  panNumber: string;
  cibilScore: string;
  adhaarDoc: string;
  panDoc: string;
  cibilDoc: string;
  isCompleteProfile:boolean;
}

export interface UserDocumentsDto {
  adhaarDocUrl: string;
  panDocUrl: string;
}

export interface UserCompleteUpdateDto {
  name: string;
  email: string;
  customerId?: string;
  phone?: string;
  status: "VERIFIED" | "NOT_VERIFIED";
  dob?: string;
  job?: string;
  income?: string;
  gender?: "male" | "female" | "other";

  // Identification info
  adhaarNumber?: string;
  panNumber?: string;
  cibilScore?: string;

  // Documents
  documents?: UserDocumentsDto;
}
