import { MESSAGES } from "@/config/constants/message";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { IAdminVendorMgtService } from "@/interfaces/services/admin/admin.vendormgt.interface";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { success } from "zod";

@injectable()
export class AdminVendorMgtController {
  constructor(
    @inject("IAdminVendorMgtService")
    private readonly _IAdminVendorService: IAdminVendorMgtService
  ) {}

  async getAccounts(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search ? String(req.query.search) : undefined;

      const role = req.query.role as "vendor" | "user";

      if (!role || !["vendor", "user"].includes(role)) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "role query params must be vendor or user",
        });
      }
      const result = await this._IAdminVendorService.getAllVendors({
        page,
        limit,
        search,
        role,
      });
      return res
        .status(STATUS_CODES.SUCCESS)
        .json({
          success: true,
          data: result.data,
          total: result.total,
          page: result.page,
          limit: result.limit,
        });
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: MESSAGES.FAILURE,
          error: (error as Error).message,
        });
    }
  }

  async updatedStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { role, status } = req.body;

      if (!id || !role || !status) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: "Missing required parameter" });
      }

      const updated = await this._IAdminVendorService.updateStatus(
        id,
        role,
        status
      );
      if (!updated) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ success: false, message: MESSAGES.NOT_FOUND });
      }

      return res
        .status(STATUS_CODES.SUCCESS)
        .json({
          success: true,
          message: `Account ${
            status === "active" ? "unblocked" : "blocked"
          } successfully`,
          data: updated,
        });
    } catch (error) {
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.FAILURE,
        error: (error as Error).message,
      });
    }
  }
}
