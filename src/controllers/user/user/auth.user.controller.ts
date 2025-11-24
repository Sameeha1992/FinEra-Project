import { Request, Response, NextFunction } from "express";
import { UserRegisterDTO } from "../../../dto/user/auth/userRegisterDTO";
import { IAuthUserService } from "../../../interfaces/services/user/auth.userservice.interface";
import { injectable, inject } from "tsyringe";
import { LoginDto } from "../../../dto/shared/login.dto";
import { CustomError } from "../../../middleware/errorMiddleware";
import { MESSAGES } from "../../../config/constants/message";
import { STATUS_CODES } from "../../../config/constants/statusCode";
import { UserMapper } from "../../../mappers/sharedMappers/response.loginDto";
import { userInfo } from "os";

@injectable()
export class AuthUserController {
  constructor(
    @inject("IAuthUserService") private _authUserService: IAuthUserService
  ) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: UserRegisterDTO = req.body;
      console.log("userData is this", req.body);
      const createUser = await this._authUserService.registerUser(userData);
      console.log("createUserData", createUser);
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
      console.log(email, "req.body");
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
      console.error(MESSAGES.OTP_NOT_VERIFIED);
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ success: false, message: MESSAGES.OTP_NOT_VERIFIED });
    }
  }

  async Login(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("i am entering the login page");

      const loginCredentials: LoginDto = req.body;
      console.log(req.body, "req.body of the login");

      console.log("🔍 Calling authUserService.Login...");

      const { user, accessToken, refreshToken } =
        await this._authUserService.Login(loginCredentials);

      res.cookie("userRefreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie("userAccessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      });

      console.log("Refresh token cookie set");

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        user,
        message: MESSAGES.LOGIN_SUCCESS,
      });

      console.log("Login completed successfully");
    } catch (error: any) {
      res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ success: false, message: MESSAGES.INVALID_CREDENTIALS });
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken: string = req.cookies.userRefreshToken;
      if (!refreshToken) {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: "no refresh token availabl" });
        return;
      }
      const accessToken: string = await this._authUserService.refreshToken(
        refreshToken
      );

      res
        .status(STATUS_CODES.ACCEPTED)
        .json({ message: "new token created", accessToken: accessToken });
    } catch (error) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ success: false, message: "no access token available" });
    }
  }
}
