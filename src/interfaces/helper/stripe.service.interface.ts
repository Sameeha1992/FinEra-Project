import { CreateCheckoutSessionInput } from "@/dto/shared/stripe.types";
import Stripe from "stripe";

export interface IStripeService {
  createCheckoutSession(data: CreateCheckoutSessionInput): Promise<string>;
  constructWebhookEvent(
    payload: Buffer,
    signature: string,
  ): Promise<Stripe.Event>;
}
