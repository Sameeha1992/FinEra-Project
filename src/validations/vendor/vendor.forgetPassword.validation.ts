import { z } from "zod";

export const vendorForgetPasswordSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email format"),
  }),
});