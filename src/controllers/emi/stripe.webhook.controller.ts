import { MESSAGES } from "@/config/constants/message";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { IStripeService } from "@/interfaces/helper/stripe.service.interface";
import { IEmiPaymentService } from "@/interfaces/services/emi/emi.payment.interface";
import { CustomError } from "@/middleware/errorMiddleware";
import { env } from "@/validations/envValidation";
import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import { inject, injectable } from "tsyringe";

@injectable()
export class StripeWebhookController {
  constructor(
    @inject("IEmiPaymentService")
    private _iEmiPaymentService: IEmiPaymentService,
    @inject("IStripeService") private readonly _iStripeService: IStripeService,
  ) {}

  async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const signature = req.headers["stripe-signature"];
      if (!signature || typeof signature !== "string") {
        throw new CustomError(
          MESSAGES.STRIPE_SIGNATURE_MISSING,
          STATUS_CODES.BAD_REQUEST,
        );
      }

      const event = await this._iStripeService.constructWebhookEvent(
        req.body as Buffer,
        signature,
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status === "paid") {
          const emiId = session.metadata?.emiId;

          if (!emiId) {
            throw new CustomError(
              MESSAGES.INVALID_REQUEST,
              STATUS_CODES.BAD_REQUEST,
            );
          }
          await this._iEmiPaymentService.handleSuccessfulEmiPayment(emiId);
        }
      }
      res
        .status(STATUS_CODES.SUCCESS)
        .json({ success: true, message: MESSAGES.WEBHOOK_RECIEVED });
    } catch (error) {
      console.log("issue with teh stripe", error);
      next(error);
    }
  }
}
