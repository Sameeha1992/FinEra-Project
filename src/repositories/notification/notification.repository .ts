import Notification, { INotification } from "@/models/notification/emi.notification.schema";
import { BaseRepository } from "../base_repository";
import { INotificationRepository } from "@/interfaces/repositories/notification/user.notification.repository.interface";
import { inject, injectable } from "tsyringe";
import { createReposNotificationDto } from "@/dto/notification/notification.dto";

@injectable()
export class NotificationRepository extends BaseRepository<INotification> implements INotificationRepository{
  constructor(){
    super(Notification)
  }

  async createNotification(data: createReposNotificationDto): Promise<INotification> {
      return await Notification.create(data);
  }

  async getNotificationsByUserId(userId: string): Promise<INotification[]> {
      return await Notification.find({userId}).sort({createdAt:-1})
  }

  async markAsRead(notificationId: string): Promise<INotification |null> {
      return await Notification.findByIdAndUpdate(notificationId,{isRead:true},{new:true})
  }

  async markAllAsRead(userId: string): Promise<void> {
      await Notification.updateMany({userId,isRead:false},{$set:{isRead:true}})
  }

  async getUnreadCount(userId: string): Promise<number> {
      return await Notification.countDocuments({userId,isRead:false})
  }

  async existsByTypeAndEmi(emiId: string, type: string, startDate: Date, endDate: Date): Promise<boolean> {
      const count = await Notification.countDocuments({
          emiId: emiId,
          type: type,
          createdAt: { $gte: startDate, $lte: endDate }
      });
      return count > 0;
  }
}