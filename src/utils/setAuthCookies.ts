import { CookieOptions } from "express";
import { env } from "@/validations/envValidation";


export const isProduction = env.NODE_ENV === "production"


export const getCookieOptions = (): {
  accessToken: CookieOptions;
  refreshToken: CookieOptions;
} => {
  const baseOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" :"lax",
  };

  return {
    accessToken: {
      ...baseOptions,
      maxAge:env.ACCESS_TOKEN_COOKIE_MAX_AGE  // 15 minutes
    },

    refreshToken: {
      ...baseOptions,
      maxAge:env.REFRESH_TOKEN_COOKIE_MAX_AGE  // 30 days
    },
  };
};