import {
  CreateVendorNotificationDto,
  VendorNotificationListDto,
  VendorNotificationResponseDto,
} from "@/dto/notification/vendor.notification.dto";

export interface IVendorNotificationService {
  createNotification(
    data: CreateVendorNotificationDto,
  ): Promise<VendorNotificationResponseDto>;

  getVendorNotifications(
    vendorId: string,
    page: number,
    limit: number,
  ): Promise<VendorNotificationListDto>;

  getUnreadCount(vendorId: string): Promise<number>;

  markAsRead(
    notificationId: string,
    vendorId: string,
  ): Promise<VendorNotificationResponseDto | null>;

  markAllAsRead(vendorId: string): Promise<void>;

  createOverdueNotificationIfNotExists(
    data: CreateVendorNotificationDto,
  ): Promise<VendorNotificationResponseDto | null>;
}
