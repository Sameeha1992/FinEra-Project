import { Status } from "@/models/enums/enum";

export interface VendorUserVerificationItemDto {
  userId: string;
  customerId:string;
  name: string;
  email: string;
  phone: string;
  status: string;
  createdAt: Date;
}

export interface VendorUserVerificationListDto {
  users: VendorUserVerificationItemDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpdateUserVerificationStatusDto {
  userId: string;
  status: Status;
}