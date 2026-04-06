import { NotificationResponseDTO } from "@/dto/notification/notification.dto";
import { INotification } from "@/models/notification/emi.notification.schema";
export class NotificationMapper {
  static toResponseDTO(notification: INotification): NotificationResponseDTO {
    return {
      id: notification.id.toString(),
      userId: notification.userId.toString(),
      emiId: notification.emiId ? notification.emiId.toString() : undefined,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };
  }

  static toResponseDTOList(
    notifications: INotification[],
  ): NotificationResponseDTO[] {
    return notifications.map((notification) =>
      this.toResponseDTO(notification),
    );
  }
}
