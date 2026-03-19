import { MESSAGES } from "@/config/constants/message";
import stripe from "@/config/stripe";
import { CreateCheckoutSessionInput } from "@/dto/shared/stripe.types";
import { IStripeService } from "@/interfaces/helper/stripe.service.interface";
import { CustomError } from "@/middleware/errorMiddleware";
import { env } from "@/validations/envValidation";
import Stripe from "stripe";
import { injectable } from "tsyringe";

@injectable()
export class StripeService implements IStripeService{
     async createCheckoutSession(data: CreateCheckoutSessionInput): Promise<string> {
         const session = await stripe.checkout.sessions.create({
            mode:"payment",
            payment_method_types:["card"],

            success_url:data.successUrl,
            cancel_url:data.cancelUrl,

            line_items:[
                {
                    quantity:1,
                    price_data:{
                        currency:"inr",
                        product_data:{
                            name:`EMI ${data.emiNumber}`,

                        },
                        unit_amount:Math.round(data.amount * 100),
                    },
                },
            ],

            metadata:{
                emiId:data.emiId,
                loanId:data.loanId,
                userId:data.userId,
                emiNumber:data.emiNumber
            }
         });

         if(!session.url){
            throw new CustomError(MESSAGES.STRIPE_CHECKOUT_SESSION_URL_NOT_GENERATED)
         }
         return session.url;
     }

     async constructWebhookEvent(payload: Buffer, signature: string): Promise<Stripe.Event> {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  }
}