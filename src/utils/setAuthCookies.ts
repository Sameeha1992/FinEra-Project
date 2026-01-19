import { CookieOptions } from "express";
import { env } from "process";

const AccessTokenExpiry = parseInt(env.ACCESS_TOKEN_EXPIRY ||"900000");
const RefreshTokenExpiry = parseInt(env.REFRESH_TOKEN_EXPIRY || "2592000000")

export const getCookieOptions = (): {
  accessToken: CookieOptions;
  refreshToken: CookieOptions;
} => {
  const baseOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  return {
    accessToken: {
      ...baseOptions,
      maxAge:AccessTokenExpiry  // 15 minutes
    },

    refreshToken: {
      ...baseOptions,
      maxAge:RefreshTokenExpiry  // 30 days
    },
  };
};