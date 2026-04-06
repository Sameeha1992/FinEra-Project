import { IVendorNotification } from "@/models/notification/vendor.notification";
import { IBaseRepository } from "../baseRepository.interface";
import { VendorNotificationType } from "@/models/enums/enum";

export interface IVendorNotificationRepository extends IBaseRepository<IVendorNotification> {
  createNotification(
    data: Partial<IVendorNotification>,
  ): Promise<IVendorNotification>;

  getVendorNotifications(
    vendorId: string,
    page: number,
    limit: number,
  ): Promise<{
    notifications: IVendorNotification[];
    total: number;
  }>;

  getUnreadCount(vendorId: string): Promise<number>;

  markAsRead(
    notificationId: string,
    vendorId: string,
  ): Promise<IVendorNotification | null>;

  markAllAsRead(vendorId: string): Promise<void>;

  findExistingOverdueNotification(
    vendorId: string,
    emiId: string,
    type: VendorNotificationType,
  ): Promise<IVendorNotification | null>;
}
