import { z } from "zod";

export const loginUserSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .max(100, "Email is too long"),

    password: z
      .string()
      .min(1, "Password is required")
      .max(100, "Password is too long"),
  }),
  params: z.object({}),
  query: z.object({}),
});