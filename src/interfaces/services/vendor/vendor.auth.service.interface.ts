import { LoginDto, LoginResponseDto } from "../../../dto/shared/login.dto";
import { OtpVerifyDto } from "../../../dto/user/auth/otp-generation.dto";
import {
  VendorRegisterDto,
  VendorResponseDto,
} from "../../../dto/vendorDto/vendor.auth.dto";
import { IOtp } from "../../../interfaces/helper/otp.Interface";

export interface IVendorAuthService {
  vendorRegister(dto: VendorRegisterDto): Promise<VendorResponseDto>;
  generateOtp(email: string): Promise<IOtp>;
  verifyOtp(vendorData: OtpVerifyDto): Promise<boolean>;
  vendorLogin(credentials:LoginDto):Promise<{vendor:LoginResponseDto,accessToken:string,refreshToken:string}>
  refreshToken(refreshToken:string):Promise<string>
}
