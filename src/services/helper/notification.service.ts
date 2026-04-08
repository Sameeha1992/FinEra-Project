import { MESSAGES } from "@/config/constants/message";
import { STATUS_CODES } from "@/config/constants/statusCode";
import {
  CreateNotificationDTO,
  NotificationResponseDTO,
  UnreadCountResponseDTO,
} from "@/dto/notification/notification.dto";
import { INotificationRepository } from "@/interfaces/repositories/notification/user.notification.repository.interface";
import { INotificationService } from "@/interfaces/services/notifications/notification.service.interface";
import { NotificationMapper } from "@/mappers/notification/notification.mappers";
import { CustomError } from "@/middleware/errorMiddleware";
import { Types } from "mongoose";
import { inject, injectable, container } from "tsyringe";
import { Server as SocketIOServer } from "socket.io";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject("INotificationRepository")
    private readonly _iNotificationRepository: INotificationRepository,
  ) {}

  async createNotification(
    data: CreateNotificationDTO,
  ): Promise<NotificationResponseDTO> {
    const { userId, emiId, title, message, type } = data;

    if (!userId || !title || !message || !type) {
      throw new CustomError(MESSAGES.INVALID_REQUEST, STATUS_CODES.BAD_REQUEST);
    }

    const notification = await this._iNotificationRepository.createNotification(
      {
        userId: new Types.ObjectId(userId),
        emiId: emiId ? new Types.ObjectId(emiId) : undefined,
        title,
        message,
        type,
      },
    );
    const notificationResponse = NotificationMapper.toResponseDTO(notification);

    // Emit real-time notification via Socket.IO
    // Resolve SocketIOServer lazily to avoid circular/timing issues in DI
    console.log(`NotificationService: Emitting new_notification to room user_${userId}`);
    const io = container.resolve<SocketIOServer>("SocketIOServer");
    io.to(`user_${userId}`).emit("new_notification", notificationResponse);

    return notificationResponse;
  }

  async getNotificationsByUserId(userId: string): Promise<NotificationResponseDTO[]> {
      if(!userId){
        throw new CustomError(MESSAGES.INVALID_REQUEST,STATUS_CODES.BAD_REQUEST)
      }

      const notification = await this._iNotificationRepository.getNotificationsByUserId(userId);
      return NotificationMapper.toResponseDTOList(notification)
  }

  async markAsRead(notificationId: string): Promise<NotificationResponseDTO> {
    if (!notificationId) {
      throw new CustomError(
        MESSAGES.INVALID_REQUEST,
        STATUS_CODES.BAD_REQUEST
      );
    }

    const notification =
      await this._iNotificationRepository.markAsRead(notificationId);

    if (!notification) {
      throw new CustomError(
        MESSAGES.NOTIFICATION_NOT_FOUND,
        STATUS_CODES.NOT_FOUND
      );
    }

    return NotificationMapper.toResponseDTO(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    if (!userId) {
      throw new CustomError(
        MESSAGES.INVALID_REQUEST,
        STATUS_CODES.BAD_REQUEST
      );
    }

    await this._iNotificationRepository.markAllAsRead(userId);
  }

  async getUnreadCount(userId: string): Promise<UnreadCountResponseDTO> {
    if (!userId) {
      throw new CustomError(
        MESSAGES.INVALID_REQUEST,
        STATUS_CODES.BAD_REQUEST
      );
    }

    const unreadCount =
      await this._iNotificationRepository.getUnreadCount(userId);

    return { unreadCount };
  }

  async checkNotificationExists(
    emiId: string,
    type: string,
    startDate: Date,
    endDate: Date,
  ): Promise<boolean> {
    return await this._iNotificationRepository.existsByTypeAndEmi(
      emiId,
      type,
      startDate,
      endDate,
    );
  }
}
