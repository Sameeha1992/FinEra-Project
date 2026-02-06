import { STATUS_CODES } from "../../../config/constants/statusCode";
import { MESSAGES } from "../../../config/constants/message";
import { IVendorAuthService } from "../../../interfaces/services/vendor/vendor.auth.service.interface";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import logger from "../../../middleware/loggerMiddleware";
import { LoginDto } from "../../../dto/shared/login.dto";
import { getCookieOptions, isProduction } from "../../../utils/setAuthCookies";
import { OtpVerifyForgetDto } from "../../../dto/user/auth/otp-generation.dto";
import { CustomError } from "../../../middleware/errorMiddleware";
import { clearAuthCookies } from "@/utils/clearAuthCookies";
import { success } from "zod";
import { Role } from "@/models/enums/enum";
import { env } from "@/validations/envValidation";


@injectable()
export class VendorAuthController {
  constructor(
    @inject("IVendorAuthService")
    private _IvendorAuthService: IVendorAuthService
  ) {}

  async registerVendor(req: Request, res: Response, next: NextFunction) {
    try {
      const vendorData = req.body;
      const createVendor = await this._IvendorAuthService.vendorRegister(
        vendorData
      );
      res.status(201).json({ success: true, data: createVendor });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ success: false, error: error.message });
      }
    }
  }

  async generateOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;
      await this._IvendorAuthService.generateOtp(email);

      res
        .status(200)
        .json({
          success: true,
          message: MESSAGES.OTP_SENT,
          email: email,
          debug: "Email service temporarly disabled",
        });
    } catch (error) {
      console.error("Generate OTP error:", error);
      res.status(500).json({ success: false, error: "OTP generation failed" });
    }
  }

  async verifyOtp(req:Request,res:Response,next:NextFunction){

    try {
          const isVerified = await this._IvendorAuthService.verifyOtp(req.body);

          if(!isVerified){
            return res.status(STATUS_CODES.BAD_REQUEST).json({success:false,message:MESSAGES.OTP_INVALID})
          }
          res.status(STATUS_CODES.SUCCESS).json({success:true,message:MESSAGES.OTP_VERIFIED})
    
    } catch (error) {
      logger.error({error:error},"OTP verification for vendor had failed in the controller");
      return res.status(STATUS_CODES.BAD_REQUEST).json({success:false,message:MESSAGES.OTP_VERIFICATION_FAILED})
    }
  }

  async login(req:Request,res:Response,next:NextFunction){

  try {
    const credentials: LoginDto = req.body;
    const {vendor,accessToken,refreshToken} = await this._IvendorAuthService.vendorLogin(credentials);
    console.log("vendor",vendor)
    console.log("accesstoken",accessToken)
    console.log(Role)
    
    const cookieOptions = getCookieOptions();
    res.cookie("refreshToken",refreshToken,cookieOptions.refreshToken);

    res.status(STATUS_CODES.SUCCESS).json({
      success:true,
      message:"Vendor Login Successful",
      accessToken,
      vendor
    })
  } catch (error) {
    res.status(STATUS_CODES.UNAUTHORIZED).json({success:false,message:MESSAGES.INVALID_CREDENTIALS});
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

    // Get only access token
    const {accessToken,refreshToken:newRefreshToken} = await this._IvendorAuthService.refreshToken(refreshToken);

     res.cookie("refreshToken",newRefreshToken,{
      httpOnly:true,
      secure:isProduction,
      sameSite:isProduction,
      maxAge:env.REFRESH_TOKEN_COOKIE_MAX_AGE
     })
   

    res.status(STATUS_CODES.ACCEPTED).json({
      success: true,
      message: MESSAGES.ACCESS_TOKEN_REFRESHED,
      accessToken
    });
  } catch (error) {
    next(error);
  }
}


async forgetPassword(req:Request,res:Response,next:NextFunction){
    try {

      const email = req.body.email;
      if(!email){
        return res.status(STATUS_CODES.NOT_FOUND).json({success:false,message:"Email not required for forget password"})
      }

      const result = await this._IvendorAuthService.forgetVendorPassword(email);

      res.status(STATUS_CODES.SUCCESS).json({success:true,message:result})
      logger.info({email},"forget password OTP sent successfully")

      
    } catch (error) {
      logger.error({err:error},"Forget password failed");
      
    }
  }

  async verifyforgetPassword(req:Request,res:Response,next:NextFunction){

    try {
      const {email,otp} = req.body;
      console.log(email,otp,"email,otp")

      if(!email || !otp){
        return res.status(STATUS_CODES.BAD_REQUEST).json({success:false,message:"Email and OTP are required"})
      }

      const otpData:OtpVerifyForgetDto={email,otp};
      console.log(otpData,"otpdata")
      await this._IvendorAuthService.verifyVendorForgetOtp(otpData);

      logger.info({email},"Forget password OTP verified successfully");
      res.status(STATUS_CODES.SUCCESS).json({success:true,message:"OTP verified you can now reset your password"})
    } catch (error) {
      logger.error({error},"Forget password otp verification failed")
      next(error)
    }

  }

  async resetPassword(req:Request,res:Response,next:NextFunction){

    try {

      const {email,password} = req.body;

      if(!email || !password){
        return res.status(STATUS_CODES.BAD_REQUEST).json({message:"Email and password required"})
      }

      const result = await this._IvendorAuthService.resetPassword(email,password);
      res.status(STATUS_CODES.SUCCESS).json({message:result})
      
    } catch (error) {
      console.error("Reset password error:",error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message:error || MESSAGES.PASSWORD_RESET_FAILED})
      
    }
  }

  async googlelogin(req:Request,res:Response,next:NextFunction){

    try {
      const token = req.body.token;
      if(!token){
        throw new CustomError("Google token not required for vendor")
      }

      const {accessToken,refreshToken,vendor} = await this._IvendorAuthService.googleLogin(token)

      const cookieOptions = getCookieOptions();
      res.cookie("refreshToken",refreshToken,cookieOptions.refreshToken);

      res.status(STATUS_CODES.SUCCESS).json({success:true,message:MESSAGES.LOGIN_SUCCESS,vendor})
    } catch (error) {
      next(error)
    }
  }
 
  async logout(req:Request,res:Response,next:NextFunction){
    try {
      const refreshToken = req.cookies?.refreshToken;

      if(!refreshToken){
        return res.status(STATUS_CODES.BAD_REQUEST)
        .json({message:MESSAGES.INVALID_REFRESH_TOKEN})
      }

      await this._IvendorAuthService.logout(refreshToken);
      clearAuthCookies(res);

      res.status(STATUS_CODES.SUCCESS)
      .json({success:true,message:MESSAGES.LOGOUT_SUCCESS})
      
    } catch (error) {
      res.status(STATUS_CODES.BAD_REQUEST).json({success:false,message:MESSAGES.LOGOUT_FAILED})
    }
  }

}
