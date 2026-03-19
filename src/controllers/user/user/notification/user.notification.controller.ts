import { MESSAGES } from "@/config/constants/message";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { INotificationService } from "@/interfaces/services/notifications/notification.service.interface";
import { CustomError } from "@/middleware/errorMiddleware";
import { AuthenticateRequest } from "@/types/express/authenticateRequest.interface";
import { Request,Response,NextFunction } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class UserNotificationController {
  constructor(
    @inject("INotificationService")
    private readonly _iNotificationService: INotificationService,
  ) {}
  async getNotifications(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {

        const userId = req.user?.id;
        if(!userId){
            throw new CustomError(MESSAGES.UNAUTHORIZED_ACCESS,STATUS_CODES.BAD_REQUEST)
        }

        const notification = await this._iNotificationService.getNotificationsByUserId(userId);
        

        res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: MESSAGES.NOTIFICATIONS_FETCHED_SUCCESSFULLY,
      data: notification,
    });

    } catch (error) {

        console.log("'notification getting issue",error)
        next(error)
    }
  }

  async markAsRead(req: Request, res: Response): Promise<void> {
    const { notificationId } = req.params;

    const notification =
      await this._iNotificationService.markAsRead(notificationId);
      console.log("notifications",notification)

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: MESSAGES.NOTIFICATION_MARKED_AS_READ,
      data: notification,
    });
  }

  async markAllAsRead(req: AuthenticateRequest, res: Response): Promise<void> {
    const userId = req.user?.id;

    await this._iNotificationService.markAllAsRead(userId!);

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: MESSAGES.ALL_NOTIFICATIONS_MARKED_AS_READ,
    });
  }

  async getUnreadCount(req: AuthenticateRequest, res: Response): Promise<void> {
    const userId = req.user?.id;

    const unreadCount = await this._iNotificationService.getUnreadCount(userId!);

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: MESSAGES.UNREAD_COUNT_FETCHED_SUCCESSFULLY,
      data: unreadCount,
    });
  }
}
