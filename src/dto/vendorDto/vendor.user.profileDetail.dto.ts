import { Status } from "@/models/enums/enum";

export interface VendorUserProfileDetailDto {
  userId: string;
  name: string;
  customerId: string;
  email: string;
  phone?: string;
  status: Status;
  dob?: string;
  job?: string;
  income?: string;
  gender?: "male" | "female" | "other";
  adhaarNumber?: string;
  panNumber?: string;
  cibilScore?: string;
  adhaarDocUrl?: string;
  panDocUrl?: string;
  cibilDocUrl?: string;
  isProfileComplete: boolean;
}