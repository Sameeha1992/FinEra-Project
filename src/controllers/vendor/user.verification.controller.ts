import { MESSAGES } from "@/config/constants/message";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { VendorApplicationQueryDTO } from "@/dto/vendorDto/user.verification.list.dto";
import { IUserVerificationService } from "@/interfaces/services/vendor/user.verification.interface";
import { CustomError } from "@/middleware/errorMiddleware";
import { AuthenticateRequest } from "@/types/express/authenticateRequest.interface";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { success } from "zod";

@injectable()
export class UserVerificationController {
  constructor(
    @inject("IUserVerificationService")
    private _IUserVerificationService: IUserVerificationService,
  ) {}

  async getUserApplicationList(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const vendorId = req.user?.id;

      if (!vendorId) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: MESSAGES.VENDOR_NOT_FOUND,
        });
      }

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string | undefined;

      const query: VendorApplicationQueryDTO = {
        vendorId,
        page,
        limit,
        search,
      };

      const result =
        await this._IUserVerificationService.getUserApplicationList(query);

      return res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.USER_FETCHED_SUCCESSFULLY,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationDetail(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const vendorId = req.user?.id;
      const applicationId = req.params.id;
      console.log("vendorId for applucation",vendorId);
      console.log("applicationid",applicationId)

      if (!vendorId || !applicationId) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: MESSAGES.INVALID_REQUEST });
      }

      const application =
        await this._IUserVerificationService.getApplicationDetail(
          applicationId,
          vendorId,
        );

            console.log("Application from service:", application); // 👈 ADD THIS


      if (!application) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({
            success: false,
            message: MESSAGES.LOAN_APPLICATION_NOT_FOUND,
          });
      }

      return res
        .status(STATUS_CODES.SUCCESS)
        .json({ success: true, data: application });
    } catch (error) {
      next(error);
    }
  }
}
