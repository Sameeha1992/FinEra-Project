import { Request, Response, NextFunction } from "express"; // ← IMPORT THIS!
import { container } from "tsyringe";
import { LoginDto } from "../../../dto/shared/login.dto";
import { UserLoginService } from "../../../services/shared/login/user.login.stratergy";
import { env } from "@/validations/envValidation";
import { isProduction } from "@/utils/setAuthCookies";

const userLoginService = container.resolve(UserLoginService);

export const vendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const credentials: LoginDto = req.body;
    const { user, accessToken, refreshToken } = await userLoginService.login(
      credentials
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction, // true in production (HTTPS)
      sameSite: isProduction,
      maxAge: env.ACCESS_TOKEN_COOKIE_MAX_AGE,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction,
      maxAge:env.REFRESH_TOKEN_COOKIE_MAX_AGE,
    });

    res.json({
      success: true,
      message: "Login Successfull",
      user
    });
  } catch (error) {
    next(error);
  }
};
