import { z } from "zod";

export const vendorRegisterSchema = z.object({
  body:z.object({
    name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name is too long"),

  email: z
    .string()
    .email("Invalid email format"),

  registerNumber: z
    .string()
    .min(3, "Register number is required")
    .max(30, "Register number is too long"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  confirmPassword: z
    .string()
    .min(6, "Confirm password is required"),

  // optional fields (controlled internally usually)
  role: z.string().optional(),
  vendorId: z.string().optional(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})
})