import { CreateCheckoutSessionInput } from "@/dto/shared/stripe.types";

export interface IStripeService{
    createCheckoutSession(data:CreateCheckoutSessionInput):Promise<string>
}