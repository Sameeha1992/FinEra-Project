import { STATUS_CODES } from "../../../config/constants/statusCode";
import { MESSAGES } from "../../../config/constants/message";
import { IVendorAuthService } from "../../../interfaces/services/vendor/vendor.auth.service.interface";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import logger from "../../../middleware/loggerMiddleware";
import { LoginDto } from "../../../dto/shared/login.dto";
import { getCookieOptions } from "../../../utils/setAuthCookies";
import { success } from "zod";

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
      console.log("vendor data",vendorData)
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ success: false, error: error.message });
      }
    }
  }

  async generateOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;
      console.log("req.body of vendor side", email);
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
          console.log(isVerified,"isverified")

          if(!isVerified){
            return res.status(STATUS_CODES.BAD_REQUEST).json({success:false,message:MESSAGES.OTP_INVALID})
          }
          res.status(STATUS_CODES.SUCCESS).json({success:true,message:MESSAGES.OTP_VERIFIED})
    
    } catch (error:any) {
      logger.error("OTP verification for vendor had failed in the controller",{error:error.message});
      return res.status(STATUS_CODES.BAD_REQUEST).json({success:false,message:MESSAGES.OTP_VERIFICATION_FAILED})
    }
  }

  async login(req:Request,res:Response,next:NextFunction){

  try {
    const credentials: LoginDto = req.body;
    console.log(credentials,"venodr data")
    const {vendor,accessToken,refreshToken} = await this._IvendorAuthService.vendorLogin(credentials);

    console.log("vendor",vendor);
    console.log(accessToken,"accessToken")
    console.log(refreshToken,"refresh token");

    
    const cookieOptions = getCookieOptions();
    res.cookie("accessToken",accessToken,cookieOptions.accessToken);
    res.cookie("refreshToken",refreshToken,cookieOptions.refreshToken);

    console.log("vendor refresh token cookie set")
    res.status(STATUS_CODES.SUCCESS).json({
      success:true,
      message:"Vendor Login Successful",
      vendor
    })
  } catch (error: any) {
    res.status(STATUS_CODES.UNAUTHORIZED).json({success:false,message:MESSAGES.INVALID_CREDENTIALS})
    next(error);
  }
  
}

async refreshToken(req:Request,res:Response,next:NextFunction){

  try {
    const refreshToken:string = req.cookies.refreshToken;
    if(!refreshToken){
      res.status(STATUS_CODES.BAD_REQUEST).json({success:false,message:MESSAGES.INVALID_REFRESH_TOKEN})
      return 
    }

    const accessToken:string = await this._IvendorAuthService.refreshToken(refreshToken);


    res.status(STATUS_CODES.ACCEPTED).json({success:true,message:"new token created with refresh token",accessToken:accessToken})
    
  } catch (error) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ success: false, message: "no access token available" });
    }
}
}
