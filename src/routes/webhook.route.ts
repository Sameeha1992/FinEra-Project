import express from "express";
import { container } from "tsyringe";

import { StripeWebhookController } from "@/controllers/emi/stripe.webhook.controller";

const router = express.Router();

const stripeWebhookController = container.resolve(StripeWebhookController);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookController.handleWebhook.bind(stripeWebhookController),
);

export default router;
