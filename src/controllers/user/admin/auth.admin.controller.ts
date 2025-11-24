import { inject, injectable } from "tsyringe";
import { IAdminAuthService } from "../../../interfaces/services/admin/admin.auth.interface";
import { Request, Response, NextFunction } from "express";
import { LoginDto } from "../../../dto/shared/login.dto";
import { STATUS_CODES } from "../../../config/constants/statusCode";
import { success } from "zod";
import { MESSAGES } from "../../../config/constants/message";

@injectable()
export class AdminAuthController {
  constructor(
    @inject("IAdminAuthService") private _adminAuthService: IAdminAuthService
  ) {}

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Controller of admin");
      const loginCredentials: LoginDto = req.body;

      console.log("Data in the req.body", loginCredentials);

      const { admin, accessToken, refreshToken } =
        await this._adminAuthService.login(loginCredentials);

      res.cookie("adminAccessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      });

      res.cookie("adminRefreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        admin,
        message: MESSAGES.LOGIN_SUCCESS,
      });
      console.log("Admin login completed successfully");
    } catch (error: any) {
      res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ success: false, message: MESSAGES.INVALID_CREDENTIALS });
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken: string = req.cookies.adminRefreshToken;
      if (!refreshToken) {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: MESSAGES.BAD_REQUEST });
        return;
      }
      const accessToken: string = await this._adminAuthService.refreshToken(
        refreshToken
      );
      res.status(STATUS_CODES.ACCEPTED).json({ message: "new token" });
    } catch (error) {}
  }
}
