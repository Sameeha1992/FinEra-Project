import { VendorNotificationType } from "../../models/enums/enum";

export interface CreateVendorNotificationDto {
  vendorId: string;
  userId?: string;
  applicationId?: string;
  loanId?: string;
  emiId?: string;
  title: string;
  message: string;
  type: VendorNotificationType;
}

export interface VendorNotificationResponseDto {
  notificationId: string;
  vendorId: string;
  userId?: string;
  applicationId?: string;
  loanId?: string;
  emiId?: string;
  title: string;
  message: string;
  type: VendorNotificationType;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export interface VendorNotificationListDto {
  notifications: VendorNotificationResponseDto[];
  total: number;
}