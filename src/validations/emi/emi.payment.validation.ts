import { z } from "zod";

export const createEmiPaymentSessionSchema = z.object({
  body: z.object({
    emiId: z
      .string()
      .trim()
      .min(1, "EMI id is required"),
  }),
  params: z.object({}),
  query: z.object({}),
});