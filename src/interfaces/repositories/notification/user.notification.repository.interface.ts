import { createReposNotificationDto } from "@/dto/notification/notification.dto";
import { IBaseRepository } from "@/interfaces/repositories/baseRepository.interface";
import { INotification } from "@/models/notification/emi.notification.schema";

export interface INotificationRepository extends IBaseRepository<INotification> {
  createNotification(data: createReposNotificationDto): Promise<INotification>;
  getNotificationsByUserId(userId: string): Promise<INotification[]>;
  markAsRead(notificationId: string): Promise<INotification | null>;
  markAllAsRead(userId: string): Promise<void>;
  getUnreadCount(userId: string): Promise<number>;
  existsByTypeAndEmi(
    emiId: string,
    type: string,
    startDate: Date,
    endDate: Date,
  ): Promise<boolean>;
}
