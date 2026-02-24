import { positive, z } from "zod";
import { Errors } from "@/config/constants/envError";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce
    .number({ message: Errors.ENV_PORT_ERROR })
    .positive()
    .max(65535),

  // Mongo
  MONGODB_URL: z
    .string({ message: Errors.ENV_MONGODB_URI_ERROR })
    .min(1),

  // CORS
  CORS_ORIGIN: z.string().url(),

  // JWT
  JWT_ACCESS_SECRET: z
    .string({ message: Errors.ENV_ACCESS_TOKEN_ERROR })
    .min(1),

  JWT_REFRESH_SECRET: z
    .string({ message: Errors.ENV_REFRESH_TOKEN_ERROR })
    .min(1),

  ACCESS_TOKEN_EXPIRY: z.coerce
    .number({ message: Errors.ENV_ACCESS_TOKEN_EXPIRATION_TIME_ERROR })
    .positive(),

  REFRESH_TOKEN_EXPIRY: z.coerce
    .number({ message: Errors.ENV_REFRESH_TOKEN_EXPIRATION_TIME_ERROR })
    .positive(),

    REFRESH_TOKEN_COOKIE_MAX_AGE:z.coerce
    .number({message:Errors.ENV_REFRESH_TOKEN_EXPIRATION_TIME_ERROR})
    .positive(),

    ACCESS_TOKEN_COOKIE_MAX_AGE:z.coerce.number({message:Errors.ENV_ACCESS_TOKEN_MAX_AGE_MISSING})
    .positive(),
  // Email
  EMAIL_USER: z
    .string({ message: Errors.ENV_EMAIL_ERROR })
    .email(),

  EMAIL_PASSWORD: z
    .string({ message: Errors.ENV_EMAIL_PASSWORD_ERROR })
    .min(1),

  // Redis
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.coerce.number().positive(),
  REDIS_USER: z.string().min(1),
  REDIS_PASS: z.string().min(1),

  // Google OAuth (⚠️ typo fixed)
  GGOGLE_CLIENT_ID: z.string().min(1),

  // AWS / S3
  AWS_ACCESS_KEY: z
    .string({ message: Errors.S3_ACCESS_KEY_ERROR })
    .min(1),

  AWS_SECRET_KEY: z
    .string({ message: Errors.S3_SECRET_ACCESS_KEY_ERROR })
    .min(1),

  AWS_REGION_NAME: z
    .string({ message: Errors.S3_REGION_ERROR })
    .min(1),

  AWS_BUCKET_NAME: z
    .string({ message: Errors.S3_BUCKET_NAME_ERROR })
    .min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Environment validation failed:");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
