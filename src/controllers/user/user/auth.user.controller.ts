import { Request, Response, NextFunction } from "express";
import { UserRegisterDTO } from "../../../dto/user/auth/userRegisterDTO";
import { IAuthUserService } from "../../../interfaces/services/user/auth.userservice.interface";
import { injectable, inject } from "tsyringe";
import { LoginDto } from "../../../dto/shared/login.dto";
import { CustomError } from "../../../middleware/errorMiddleware";
import { MESSAGES } from "../../../config/constants/message";
import { STATUS_CODES } from "../../../config/constants/statusCode";
import logger from "../../../middleware/loggerMiddleware";
import { OtpVerifyForgetDto } from "../../../dto/user/auth/otp-generation.dto";
import { getCookieOptions, isProduction } from "../../../utils/setAuthCookies";
import { env } from "@/validations/envValidation";
import { clearAuthCookies } from "@/utils/clearAuthCookies";
import { success } from "zod";
import { Role } from "@/models/enums/enum";
import { AuthenticateRequest } from "@/types/express/authenticateRequest.interface";

@injectable()
export class AuthUserController {
  constructor(
    @inject("IAuthUserService") private _authUserService: IAuthUserService,
  ) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: UserRegisterDTO = req.body;
      const createUser = await this._authUserService.registerUser(userData);
      res.status(201).json({ success: true, data: createUser });
    } catch (error) {
      console.error("Controller error:", error);

      if (error instanceof Error) {
        return res.status(400).json({ success: false, error: error.message });
      } else {
        return res
          .status(400)
          .json({ success: false, error: "An unknown error occured" });
      }
    }
  }

  async generateOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;
      await this._authUserService.generateOtp(email);

      res.status(200).json({
        success: true,
        message: "Otp send successfully",
        email: email,
        debug: "Email service temporarly disabled",
      });
    } catch (error) {
      console.error("Generate OTP Error:", error);
      res.status(500).json({
        success: false,
        error: "OTP generation failed",
      });
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      await this._authUserService.verifyOtp(req.body);

      res
        .status(200)
        .json({ success: true, message: "Otp verified successfully" });
    } catch (error) {
      console.error(MESSAGES.OTP_NOT_VERIFIED, error);
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ success: false, message: MESSAGES.OTP_NOT_VERIFIED });
    }
  }

  async Login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginCredentials: LoginDto = req.body;

      const { user, accessToken, refreshToken } =
        await this._authUserService.Login(loginCredentials);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: env.REFRESH_TOKEN_COOKIE_MAX_AGE,
      });

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        user,
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

      const { accessToken, refreshToken: newRefreshToken } =
        await this._authUserService.refreshToken(refreshToken);

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
        .json({ success: false, message: "no access token available" });
    }
  }

  async forgetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;
      if (!email) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: "Email not required for forget password",
        });
      }

      const result = await this._authUserService.forgetPassword(email);

      res.status(STATUS_CODES.SUCCESS).json({ success: true, message: result });
      logger.info({ email }, "forget password OTP sent successfully");
    } catch (error) {
      logger.error({ err: error }, "Forget password failed");
      next(error);
    }
  }

  async verifyforgetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: "Email and OTP are required" });
      }

      const otpData: OtpVerifyForgetDto = { email, otp };
      console.log(otpData, "otpdata");
      await this._authUserService.verifyforgetOtp(otpData);

      logger.info({ email }, "Forget password OTP verified successfully");
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "OTP verified you can now reset your password",
      });
    } catch (error) {
      logger.error({ error }, "Forget password otp verification failed");
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ message: "Email and password required" });
      }

      const result = await this._authUserService.resetPassword(email, password);
      res.status(STATUS_CODES.SUCCESS).json({ message: result });
    } catch (error) {
      console.error("Reset password error:", error);
      res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: error || "Something went wrong in reset password" });
    }
  }

  async googlelogin(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.body.token;

      if (!token) {
        throw new CustomError(
          "Google token required",
          STATUS_CODES.BAD_REQUEST,
        );
      }

      const { accessToken, refreshToken, user } =
        await this._authUserService.googleLogin(token);

      const cookieOptions = getCookieOptions();
      res.cookie("refreshToken", refreshToken, cookieOptions.refreshToken);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "User logged through google",
        user,
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ message: MESSAGES.INVALID_REFRESH_TOKEN });
      }

      await this._authUserService.logout(refreshToken);
      clearAuthCookies(res);

      res
        .status(STATUS_CODES.SUCCESS)
        .json({ success: true, message: MESSAGES.LOGOUT_SUCCESS });
    } catch (error) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ success: false, message: MESSAGES.LOGOUT_FAILED });
    }
  }

  async changePassword(req: AuthenticateRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      const { currentPassword, newPassword } = req.body;


      if (!userId) {
        throw new CustomError(MESSAGES.UNAUTHORIZED_ACCESS);
      }

      if (!currentPassword || !newPassword) {
        throw new CustomError(MESSAGES.REQUIRED_FIELD_MISSING);
      }

      await this._authUserService.changePassword(
        userId,
        currentPassword,
        newPassword,
      );

      res
        .status(STATUS_CODES.SUCCESS)
        .json({ success: true, message: MESSAGES.PASSWORD_CHANGE_SUCCESS });
      logger.info(MESSAGES.PASSWORD_CHANGE_SUCCESS);
    } catch (error) {
      logger.error(MESSAGES.SOMETHING_WENT_WRONG);
      next(error);
    }
  }
}
