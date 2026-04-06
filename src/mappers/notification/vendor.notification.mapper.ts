import {
  VendorNotificationListDto,
  VendorNotificationResponseDto,
} from "@/dto/notification/vendor.notification.dto";
import { IVendorNotification } from "@/models/notification/vendor.notification";

export class VendorNotificationMapper {
  static toResponseDto(
    notification: IVendorNotification,
  ): VendorNotificationResponseDto {
    return {
      notificationId: notification._id.toString(),
      vendorId: notification.vendorId.toString(),
      userId: notification.userId?.toString(),
      applicationId: notification.applicationId?.toString(),
      loanId: notification.loanId?.toString(),
      emiId: notification.emiId?.toString(),
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };
  }

  static toListDto(
    notifications: IVendorNotification[],
    total: number,
  ): VendorNotificationListDto {
    return {
      notifications: notifications.map((notification) =>
        this.toResponseDto(notification),
      ),
      total,
    };
  }
}
