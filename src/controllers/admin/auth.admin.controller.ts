import { inject, injectable } from "tsyringe";
import { IAdminAuthService } from "../../interfaces/services/admin/admin.auth.interface";
import { Request, Response, NextFunction } from "express";
import { LoginDto } from "../../dto/shared/login.dto";
import { STATUS_CODES } from "../../config/constants/statusCode";
import { MESSAGES } from "../../config/constants/message";
import { env } from "@/validations/envValidation";
import { clearAuthCookies } from "@/utils/clearAuthCookies";
import { isProduction } from "@/utils/setAuthCookies";
import { Role } from "@/models/enums/enum";
import { success } from "zod";

@injectable()
export class AdminAuthController {
  constructor(
    @inject("IAdminAuthService") private _adminAuthService: IAdminAuthService,
  ) {}

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginCredentials: LoginDto = req.body;

      const { admin, accessToken, refreshToken } =
        await this._adminAuthService.login(loginCredentials);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction,
        maxAge: env.REFRESH_TOKEN_COOKIE_MAX_AGE,
      });

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        admin,
        accessToken,
        message: MESSAGES.LOGIN_SUCCESS,
      });
    } catch (error) {
      res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ success: false, message: MESSAGES.INVALID_CREDENTIALS, error });
    }
  }
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken: string = req.cookies.refreshToken;
      if (!refreshToken) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: MESSAGES.INVALID_REFRESH_TOKEN });
      }

      // Only access token returned
      const { accessToken, refreshToken: newRefreshToken } =
        await this._adminAuthService.refreshToken(refreshToken);

      // const isProduction = process.env.NODE_ENV === "production";

      // Set access token cookie
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction,
        maxAge: env.REFRESH_TOKEN_COOKIE_MAX_AGE,
      });

      res.cookie("role", Role.User, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: env.ACCESS_TOKEN_COOKIE_MAX_AGE,
      });

      res
        .status(STATUS_CODES.ACCEPTED)
        .json({ message: MESSAGES.TOKEN_CREATED, accessToken });
    } catch (error) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ success: false, message: MESSAGES.ACCESS_TOKEN_NOT_FOUND });
      next(error);
    }
  }

  async logout(req: Request, res: Response, NEXT: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: MESSAGES.INVALID_REFRESH_TOKEN });
      }

      await this._adminAuthService.logout(refreshToken);
      clearAuthCookies(res);
      res
        .status(STATUS_CODES.SUCCESS)
        .json({ success: true, message: MESSAGES.LOGOUT_SUCCESS });
    } catch (error) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ success: false, message: MESSAGES.LOGOUT_FAILED, error });
    }
  }
}
