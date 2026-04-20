import { Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { IVendorDashboardService } from "@/interfaces/services/vendor/vendorDashboard.service.interface";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { MESSAGES } from "@/config/constants/message";
import { AuthenticateRequest } from "@/types/express/authenticateRequest.interface";
import { VendorReportFilterDto } from "@/dto/vendorDto/vendorDashboard.dto";

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
      console.log("vendorid of the report",vendorId)

      if (!vendorId) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ success: false, message: MESSAGES.UNAUTHORIZED_ACCESS });
      }

       const filters: VendorReportFilterDto = {
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      month: req.query.month ? Number(req.query.month) : undefined,
      year: req.query.year ? Number(req.query.year) : undefined,
      userId: req.query.userId as string,
      loanType: req.query.loanType as string,
      transactionId: req.query.transactionId as string,
    };

    console.log("filter of the report",filters)

      const data = await this.dashboardService.getExportData(vendorId,filters);
      console.log("dataa in the report",data)

      // Disable caching for export responses to ensure fresh data
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.setHeader("Surrogate-Control", "no-store");

      return res.status(STATUS_CODES.SUCCESS).json({success:true,data});
    } catch (error) {
      console.error("Error in VendorDashboardController.exportDashboardData:", error);
      next(error);
    }
  }
}
