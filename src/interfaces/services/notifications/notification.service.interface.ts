import {
  CreateNotificationDTO,
  NotificationResponseDTO,
  UnreadCountResponseDTO,
} from "@/dto/notification/notification.dto";

export interface INotificationService {
  createNotification(
    data: CreateNotificationDTO
  ): Promise<NotificationResponseDTO>;

  getNotificationsByUserId(
    userId: string
  ): Promise<NotificationResponseDTO[]>;

  markAsRead(notificationId: string): Promise<NotificationResponseDTO>;

  markAllAsRead(userId: string): Promise<void>;

  getUnreadCount(userId: string): Promise<UnreadCountResponseDTO>;

  checkNotificationExists(
    emiId: string,
    type: string,
    startDate: Date,
    endDate: Date
  ): Promise<boolean>;
}