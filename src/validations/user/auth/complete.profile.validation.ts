import { z } from "zod";

export const completeProfileSchema = z.object({
  body:z.object({
    dob: z
    .string()
    .trim()
    .min(1, "Date of birth is required"),

  job: z
    .string()
    .trim()
    .min(2, "Job is required")
    .max(100, "Job is too long"),

  income: z
    .string()
    .trim()
    .min(1, "Income is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Income must be a valid positive number",
    }),

  gender: z.enum(["male", "female", "other"], {
    message: "Gender is required",
  }),

  adhaarNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{12}$/, "Adhaar number must be exactly 12 digits"),

  panNumber: z
    .string()
    .trim()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN number format"),

  cibilScore: z
    .string()
    .trim()
    .min(1, "CIBIL score is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 300 && Number(val) <= 900, {
      message: "CIBIL score must be between 300 and 900",
    }),

  isProfileComplete: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => {
      if (typeof val === "boolean") return val;
      if (typeof val === "string") return val === "true";
      return undefined;
    }),
}),

params: z.object({}),
  query: z.object({}),
  })