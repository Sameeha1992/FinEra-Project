import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(2, "Name must be atleast 2 cahracters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be atleast 8 caharacters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});
