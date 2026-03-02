import { MESSAGES } from "@/config/constants/message";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { UpdateVendorStatusDto } from "@/dto/admin/vendor.verification.dto";
import { IVendorVerificationService } from "@/interfaces/services/admin/vendor.verification.service.interface";
import { Status } from "@/models/enums/enum";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { success } from "zod";

@injectable()
export class VendorVerificationController {
  constructor(
    @inject("IVendorVerificationService")
    private _IvendorVerificationService: IVendorVerificationService,
  ) {}

  async getVendorList(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await this._IvendorVerificationService.getVendorList(
        page,
        limit,
      );

      return res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.VENDORS_FETCHED_SUCCESSFULLY,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getVendorDetails(req: Request, res: Response): Promise<void> {
    const { vendorId } = req.params;

    const vendor =
      await this._IvendorVerificationService.getVendorDetails(vendorId);

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      data: vendor,
    });
  }

  async updateVendorStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { vendorId } = req.params;
      const { status } = req.body;

      if (!Object.values(Status).includes(status)) {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: MESSAGES.INVALID_STATUS });
        return;
      }

      const updateVendor =
        await this._IvendorVerificationService.updateVendorStatus(
          vendorId,
          status,
        );

      res
        .status(STATUS_CODES.SUCCESS)
        .json({
          success: true,
          message: MESSAGES.VENDOR_STATUS_UPDATED,
          data: updateVendor,
        });
    } catch (error) {
      next(error);
    }
  }
}
