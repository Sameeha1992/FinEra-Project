import { Request, Response, NextFunction } from "express"; // ← IMPORT THIS!
import { container } from "tsyringe";
import { LoginDto } from "../../../dto/shared/login.dto";
import { UserLoginService } from "../../../services/shared/login/user.login.stratergy";

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
      secure: process.env.NODE_ENV === "production", // true in production (HTTPS)
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login Successfull",
    });
  } catch (error: any) {
    next(error);
  }
};
