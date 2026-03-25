import { z } from "zod";

export const verifyForgetOtpSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email format"),

    otp: z
      .string()
      .length(6, "OTP must be 6 digits"),
  }),
});