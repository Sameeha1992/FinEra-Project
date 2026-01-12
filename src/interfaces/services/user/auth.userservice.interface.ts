import {
  otpgenerateDto,
  OtpVerifyDto,
  OtpVerifyForgetDto,
} from "../../../dto/user/auth/otp-generation.dto";
import { UserRegisterDTO } from "../../../dto/user/auth/userRegisterDTO";
import { IOtp } from "../../helper/otp.Interface";
import { IUser } from "../../../models/user/user.model";
import { LoginDto, LoginResponseDto } from "../../../dto/shared/login.dto";

export interface IAuthUserService {
  registerUser(userData: UserRegisterDTO): Promise<IUser>;
  generateOtp(email: string): Promise<IOtp>;
  verifyOtp(otpData: Omit<OtpVerifyDto, "expiredAt">): Promise<void>;
  Login(
    credentials: LoginDto
  ): Promise<{
    user: LoginResponseDto;
    accessToken: string;
    refreshToken: string;
  }>;
  refreshToken(refreshToken: string): Promise<string>;
  forgetPassword(email:string):Promise<string>;
  verifyforgetOtp(data:OtpVerifyForgetDto):Promise<void>;
  resetPassword(email:string,password:string):Promise<string>;
  googleLogin(googleToken:string):Promise<{accessToken:string,refreshToken:string,user:LoginResponseDto}>
}
