import { MESSAGES } from "@/config/constants/message";
import { CreateVendorNotificationDto, VendorNotificationListDto, VendorNotificationResponseDto } from "@/dto/notification/vendor.notification.dto";
import { CustomError } from "@/middleware/errorMiddleware";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { container, inject, injectable } from "tsyringe";
import { IVendorNotificationService } from "@/interfaces/services/notifications/vendor.notification.service.interface.";
import { IVendorNotificationRepository } from "@/interfaces/repositories/notification/vendor.notification";
import { Types } from "mongoose";
import { VendorNotificationMapper } from "@/mappers/notification/vendor.notification.mapper";
import { Server as SocketIOServer } from "socket.io";
import { VendorNotificationType } from "@/models/enums/enum";

@injectable()
export class VendorNotificationService implements IVendorNotificationService {
  constructor(
    @inject("IVendorNotificationRepository")
    private readonly _vendorNotificationRepository: IVendorNotificationRepository
  ) {}

  async createNotification(
    data: CreateVendorNotificationDto
  ): Promise<VendorNotificationResponseDto> {
    const {
      vendorId,
      userId,
      applicationId,
      loanId,
      emiId,
      title,
      message,
      type,
    } = data;

    if (!vendorId || !title || !message || !type) {
      throw new CustomError(MESSAGES.INVALID_REQUEST, STATUS_CODES.BAD_REQUEST);
    }

    const notification =
      await this._vendorNotificationRepository.createNotification({
        vendorId: new Types.ObjectId(vendorId),
        userId: userId ? new Types.ObjectId(userId) : undefined,
        applicationId: applicationId
          ? new Types.ObjectId(applicationId)
          : undefined,
        loanId: loanId ? new Types.ObjectId(loanId) : undefined,
        emiId: emiId ? new Types.ObjectId(emiId) : undefined,
        title,
        message,
        type,
      });

    const notificationResponse =
      VendorNotificationMapper.toResponseDto(notification);

    const io = container.resolve<SocketIOServer>("SocketIOServer");
    io.to(`vendor_${vendorId}`).emit(
      "new_vendor_notification",
      notificationResponse
    );

    return notificationResponse;
  }

  async getVendorNotifications(
    vendorId: string,
    page: number,
    limit: number
  ): Promise<VendorNotificationListDto> {
    if (!vendorId || page < 1 || limit < 1) {
      throw new CustomError(MESSAGES.INVALID_REQUEST, STATUS_CODES.BAD_REQUEST);
    }

    const { notifications, total } =
      await this._vendorNotificationRepository.getVendorNotifications(
        vendorId,
        page,
        limit
      );

    return VendorNotificationMapper.toListDto(notifications, total);
  }

  async getUnreadCount(vendorId: string): Promise<number> {
    if (!vendorId) {
      throw new CustomError(MESSAGES.INVALID_REQUEST, STATUS_CODES.BAD_REQUEST);
    }

    return await this._vendorNotificationRepository.getUnreadCount(vendorId);
  }

  async markAsRead(
    notificationId: string,
    vendorId: string
  ): Promise<VendorNotificationResponseDto | null> {
    if (!notificationId || !vendorId) {
      throw new CustomError(MESSAGES.INVALID_REQUEST, STATUS_CODES.BAD_REQUEST);
    }

    const notification = await this._vendorNotificationRepository.markAsRead(
      notificationId,
      vendorId
    );

    if (!notification) {
      throw new CustomError(
        MESSAGES.NOTIFICATION_NOT_FOUND,
        STATUS_CODES.NOT_FOUND
      );
    }

    return VendorNotificationMapper.toResponseDto(notification);
  }

  async markAllAsRead(vendorId: string): Promise<void> {
    if (!vendorId) {
      throw new CustomError(MESSAGES.INVALID_REQUEST, STATUS_CODES.BAD_REQUEST);
    }

    await this._vendorNotificationRepository.markAllAsRead(vendorId);
  }

  async createOverdueNotificationIfNotExists(
    data: CreateVendorNotificationDto
  ): Promise<VendorNotificationResponseDto | null> {
    const { vendorId, emiId, userId, loanId, title, message, type } = data;

    if (!vendorId || !emiId || !title || !message || !type) {
      throw new CustomError(MESSAGES.INVALID_REQUEST, STATUS_CODES.BAD_REQUEST);
    }

    const existing =
      await this._vendorNotificationRepository.findExistingOverdueNotification(
        vendorId,
        emiId,
        type as VendorNotificationType
      );

    if (existing) {
      return null;
    }

    const notification =
      await this._vendorNotificationRepository.createNotification({
        vendorId: new Types.ObjectId(vendorId),
        userId: userId ? new Types.ObjectId(userId) : undefined,
        loanId: loanId ? new Types.ObjectId(loanId) : undefined,
        emiId: new Types.ObjectId(emiId),
        title,
        message,
        type,
      });

    const notificationResponse =
      VendorNotificationMapper.toResponseDto(notification);

    const io = container.resolve<SocketIOServer>("SocketIOServer");
    io.to(`vendor_${vendorId}`).emit(
      "new_vendor_notification",
      notificationResponse
    );

    return notificationResponse;
  }
}