import { MESSAGES } from "@/config/constants/message";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { IEmiPaymentService } from "@/interfaces/services/emi/emi.payment.interface";
import { CustomError } from "@/middleware/errorMiddleware";
import { AuthenticateRequest } from "@/types/express/authenticateRequest.interface";
import { Request, NextFunction, Response } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class EmiPaymentController {
  constructor(
    @inject("IEmiPaymentService")
    private _iEmiPaymentService: IEmiPaymentService,
  ) {}

  async createEmiPaymentSession(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user?.id;
      const { emiId } = req.body;
      if (!userId) {
        throw new CustomError(
          MESSAGES.UNAUTHORIZED_ACCESS,
          STATUS_CODES.UNAUTHORIZED,
        );
      }

      const result = await this._iEmiPaymentService.createEmiPaymentSession(
        emiId,
        userId,
      );

      res
        .status(STATUS_CODES.SUCCESS)
        .json({
          success: true,
          message: MESSAGES.PAYMENT_IN_PROGRESS,
          data: result,
        });
    } catch (error) {
      console.log("Something issue while payment", error);
      next(error);
    }
  }
}
