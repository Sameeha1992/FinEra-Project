import { MESSAGES } from "../../config/constants/message";
import { STATUS_CODES } from "../../config/constants/statusCode";
import { IAdminDashboardService } from "../../interfaces/services/admin/admin.dashboard.service.interface";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class AdminDashboardController {
  constructor(
    @inject("IAdminDashboardService")
    private readonly _adminDashboardService: IAdminDashboardService,
  ) {}

  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this._adminDashboardService.getDashboardData();
      return res
        .status(STATUS_CODES.SUCCESS)
        .json({ success: true, message: MESSAGES.DATA_FETCH_SUCCESS, data });
    } catch (error) {
      console.log("Something issue in the admin dashbaord", error);
      next(error);
    }
  }
}
