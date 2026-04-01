import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { IVendorDashboardService } from "@/interfaces/services/vendor/vendorDashboard.service.interface";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { MESSAGES } from "@/config/constants/message";
import { AuthenticateRequest } from "@/types/express/authenticateRequest.interface";

@injectable()
export class VendorDashboardController {
  constructor(
    @inject("IVendorDashboardService")
    private readonly dashboardService: IVendorDashboardService
  ) {}

  async getDashboardData(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const vendorId = req.user?.id;

      if (!vendorId) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ success: false, message: MESSAGES.UNAUTHORIZED_ACCESS });
      }

      const dashboardData = await this.dashboardService.getDashboardData(vendorId);

      return res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "Vendor dashboard data fetched successfully",
        data: dashboardData,
      });
    } catch (error) {
      console.error("Error in VendorDashboardController.getDashboardData:", error);
      next(error);
    }
  }

  async exportDashboardData(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const vendorId = req.user?.id;

      if (!vendorId) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ success: false, message: MESSAGES.UNAUTHORIZED_ACCESS });
      }

      const csvContent = await this.dashboardService.getExportCSVPayload(vendorId);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=vendor_report_${new Date().toISOString().split('T')[0]}.csv`);
      
      return res.status(STATUS_CODES.SUCCESS).send(csvContent);
    } catch (error) {
      console.error("Error in VendorDashboardController.exportDashboardData:", error);
      next(error);
    }
  }
}
