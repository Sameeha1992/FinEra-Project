import { Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { IUserDashboardService } from "../../interfaces/services/user/user.dashboard.service.interface";
import { STATUS_CODES } from "../../config/constants/statusCode";
import { MESSAGES } from "../../config/constants/message";
import { AuthenticateRequest } from "../../types/express/authenticateRequest.interface";

@injectable()
export class UserDashboardController {
  constructor(
    @inject("IUserDashboardService")
    private readonly _dashboardService: IUserDashboardService,
  ) {}

  async getDashboard(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ success: false, message: MESSAGES.UNAUTHORIZED_ACCESS });
      }

      const dashboardData = await this._dashboardService.getUserDashboard(userId);

      return res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "User dashboard fetched successfully",
        data: dashboardData,
      });
    } catch (error) {
      next(error);
    }
  }
}
