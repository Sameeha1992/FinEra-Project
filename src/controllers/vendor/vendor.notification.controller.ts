import { MESSAGES } from "@/config/constants/message";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { IVendorNotificationService } from "@/interfaces/services/notifications/vendor.notification.service.interface.";
import { AuthenticateRequest } from "@/types/express/authenticateRequest.interface";
import { Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class VendorNotificationController {
  constructor(
    @inject("IVendorNotificationService")
    private readonly _vendorNotificationService: IVendorNotificationService,
  ) {}

  async getVendorNotifications(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const vendorId = req.user?.id as string;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result =
        await this._vendorNotificationService.getVendorNotifications(
          vendorId,
          page,
          limit,
        );

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.NOTIFICATIONS_FETCHED_SUCCESSFULLY,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const vendorId = req.user?.id as string;

      const unreadCount =
        await this._vendorNotificationService.getUnreadCount(vendorId);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.NOTIFICATIONS_FETCHED_SUCCESSFULLY,
        data: { unreadCount },
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const vendorId = req.user?.id as string;
      const { notificationId } = req.params;

      const notification = await this._vendorNotificationService.markAsRead(
        notificationId,
        vendorId,
      );

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.NOTIFICATION_MARKED_AS_READ,
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const vendorId = req.user?.id as string;

      await this._vendorNotificationService.markAllAsRead(vendorId);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.ALL_NOTIFICATIONS_MARKED_AS_READ,
      });
    } catch (error) {
      next(error);
    }
  }
}
