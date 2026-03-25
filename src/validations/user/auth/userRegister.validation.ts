// import { z } from "zod";

// export const registerUserSchema = z.object({
//   name: z.string().min(2, "Name must be atleast 2 cahracters"),
//   email: z.string().email("Invalid email address"),
//   password: z
//     .string()
//     .min(8, "Password must be atleast 8 caharacters")
//     .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
//     .regex(/[a-z]/, "Password must contain at least one lowercase letter")
//     .regex(/[0-9]/, "Password must contain at least one number")
//     .regex(
//       /[^A-Za-z0-9]/,
//       "Password must contain at least one special character"
//     ),
// });




import { z } from "zod";

export const registerUserSchema = z.object({
  body: z.object({
    name: z
      .string()
      .max(20, "Should not exceed 20 characters")
      .min(3, "Name too short")
      .regex(/^[A-Za-z\s]+$/, "Only letters and spaces allowed"),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .max(30, "Email too long"),

    phone: z
      .string()
      .length(10, "Phone must be exactly 10 digits")
      .regex(/^[0-9]+$/, "Only numbers allowed"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain uppercase letter")
      .regex(/[a-z]/, "Must contain lowercase letter")
      .regex(/[0-9]/, "Must contain number")
      .regex(/[\W_]/, "Must contain special character"),

    role: z.enum(["user", "vendor"]).optional(),
  }),

  params: z.object({}),
  query: z.object({}),
});
