import { MESSAGES } from "../../config/constants/message";
import {
  VendorRegisterDto,
  VendorResponseDto,
} from "../../dto/vendorDto/vendor.auth.dto";
import { IVendorRepository } from "../../interfaces/repositories/vendor/vendor.auth";
import { IVendorAuthService } from "../../interfaces/services/vendor/vendor.auth.service.interface";
import { CustomError } from "../../middleware/errorMiddleware";
import { IRedisService } from "../../interfaces/helper/redis.interface";
import { inject, injectable } from "tsyringe";
import { IPasswordService } from "../../interfaces/helper/passwordhashService.interface";
import { vendorRegisterMapper } from "../../mappers/vendor/vendor.register.mapper";
import { IOtp } from "../../interfaces/helper/otp.Interface";
import { IEmailService } from "../../interfaces/helper/email.sevice.interface";
import logger from "../../middleware/loggerMiddleware";
import { OtpVerifyDto, OtpVerifyForgetDto } from "../../dto/user/auth/otp-generation.dto";
import { LoginDto, LoginResponseDto } from "../../dto/shared/login.dto";
import { IVendor, VendorModel } from "../../models/vendor/vendor.model";
import { UserMapper, VendorMapper } from "../../mappers/sharedMappers/response.loginDto";
import { IVendorLoginService } from "../../interfaces/services/share/auth.vendor.interface";
import { IUserRepository } from "../../interfaces/repositories/user/userRepository.interface";
import { STATUS_CODES } from "../../config/constants/statusCode";
import { IJwtService } from "../../interfaces/helper/jwt.service.interface";
import { Role } from "../../models/enums/enum";
import { normalize } from "path";
import { error } from "console";
import { OAuth2Client } from "google-auth-library";
import { UserRegisterDTO } from "@/dto/user/auth/userRegisterDTO";
import { env } from "process";
@injectable()
export class VendorAuthService implements IVendorAuthService {
  private readonly OTP_TTLSECONDS = 10 * 60;
  constructor(
    @inject("IVendorRepository") private _vendorRepository: IVendorRepository,
    @inject("IRedisService") private _redisService: IRedisService,
    @inject("IPasswordService") private _IpasswordService: IPasswordService,
    @inject("IEmailService") private _emailService: IEmailService,
    @inject("IJwtService") private _IJwtService:IJwtService
  ) {}

  async vendorRegister(dto: VendorRegisterDto): Promise<VendorResponseDto> {
    try {
      const email = dto.email.toLowerCase().trim();
      const existingVendor = await this._vendorRepository.findByEmail(
        email
      );

      if (existingVendor) {

        throw new CustomError(MESSAGES.USER_ALREADY_EXISTS);
      }

      const isVerified = await this._redisService.isUserVerified(
        email,
        "vendor"
      );

      if (!isVerified) {

        throw new CustomError(MESSAGES.OTP_NOT_VERIFIED);
      }

      if (!dto.password) {
        throw new CustomError(MESSAGES.PASSWORD_NOT_REQUIRED);
      }

      const hashedPassword = await this._IpasswordService.hashPassword(
        dto.password
      );

      const entity = vendorRegisterMapper.toEntity(dto, hashedPassword);

      const saved = await this._vendorRepository.create(entity);

      await this._redisService.delete(`verified:vendor:${email}`);

      return vendorRegisterMapper.toResponse(saved);
    } catch (error) {
      console.error("Registration failed", error);
      throw new CustomError(MESSAGES.REGISTRATION_FAILED);
    }
  }

  async generateOtp(email: string): Promise<IOtp> {
    try {
      const normalizedEmail = email.toLowerCase().trim();

      if (!normalizedEmail) {
        throw new CustomError(MESSAGES.INVALID_EMAIL_FORMAT);
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const expireAt = new Date(Date.now() + this.OTP_TTLSECONDS * 1000);
      const redisKey = `otp:vendor:${normalizedEmail}`;
      await this._redisService.set(redisKey, otp, this.OTP_TTLSECONDS);
      const content = this._emailService.generateOtpEmailContent(Number(otp));
      const subject = "Vendor OTP Code";
      await this._emailService.sendEmail(
        normalizedEmail,
        "Vendor OTP Code",
        content
      );

      logger.debug({normalizedEmail,otp},`Vendor OTP generated`);
      logger.info({normalizedEmail},`Otp generated and send to you email`);

      return { email: normalizedEmail, otp: otp, expireAt };
    } catch (error: any) {
      logger.error({email,message: error.message},`Failed to generate OTP`, {
        
      });

      throw new CustomError("Failed to send OTP.Please try again");
    }
  }

  async verifyOtp(vendorData: OtpVerifyDto): Promise<boolean> {
    try {
      const { email, otp } = vendorData;
      const normalizedEmail = email.toLowerCase().trim();
      if (!normalizedEmail) {
        throw new CustomError("Invalid Email format");
      }
      if (!otp || otp.length !== 6) {
        throw new CustomError("OTP must be 6 digits");
      }

      const storedOTP = await this._redisService.get(
        `otp:vendor:${normalizedEmail}`
      );
      if (!storedOTP) {
        throw new CustomError("Expired or invalid OTP");
      }

      if (storedOTP !== String(otp)) {
        throw new CustomError("Invalid OTP");
      }

      await this._redisService.delete(`otp:vendor:${normalizedEmail}`);
      await this._redisService.markUserVerified(
        normalizedEmail,
        "vendor",
        this.OTP_TTLSECONDS
      );
      logger.info({normalizedEmail},`OTP verified for the email`);
      return true;
    } catch (error: any) {
      logger.error({
        email: vendorData.email,
        error: error.message,
        stack: error.stack,
      },"OTP verification failed");
      return false;
    }

    
  }

  async vendorLogin(credentials: LoginDto): Promise<{ vendor: LoginResponseDto; accessToken: string; refreshToken: string; }> {
    const vendorData:IVendor|null = await this._vendorRepository.findByEmail(credentials.email);

    if(!vendorData){
      throw new CustomError(MESSAGES.USER_NOT_FOUND,STATUS_CODES.BAD_REQUEST)
    }


    if(!vendorData.password){
      throw new CustomError(MESSAGES.PASSWORD_NOT_REQUIRED,STATUS_CODES.BAD_REQUEST)
    }

    const isPassword:boolean = await this._IpasswordService.comparePassword(credentials.password,vendorData.password);

    if(!isPassword){
      throw new CustomError(MESSAGES.PASSWORD_MISMATCH,STATUS_CODES.NOT_FOUND)
    }

    const loginResponse:LoginResponseDto = VendorMapper.VendorResponse(vendorData);

    const accessToken = this._IJwtService.generateAccessToken(vendorData._id.toString(),"vendor");
    const refreshToken = this._IJwtService.generateRefreshToken(vendorData._id.toString(),"vendor");

    return {vendor:loginResponse,accessToken,refreshToken}

  }

  async refreshToken(refreshToken:string):Promise<string>{
    const decode = await this._IJwtService.verifyToken(refreshToken,"refresh");
    if(!decode){
      throw new CustomError(MESSAGES.INVALID_REFRESH_TOKEN,STATUS_CODES.NOT_FOUND)
    }

    const vendorId = decode.id;
    const role = decode.role;

    return this._IJwtService.generateAccessToken(vendorId,role||Role.Vendor
    )
  }
  
  async forgetVendorPassword(email:string):Promise<string>{
    const vendor = await this._vendorRepository.findByEmail(email);
    if(!vendor){
      logger.error("Vendor not found in the forget password")
      throw new CustomError(MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
    }

    const otp = Math.floor(100000+Math.random()*900000).toString()

    const redisKey = `forgetotp:vendor:${email}`
    await this._redisService.set(redisKey,otp,this.OTP_TTLSECONDS)

    const content = this._emailService.generateOtpEmailContent(Number(otp))
    const subject = "Your OTP is here"

    await this._emailService.sendEmail(email,subject,content);

    logger.info({email,otp},"Otp generated for forget password on the vendor side")
    return "Otp send successfully"
  }

  async verifyVendorForgetOtp(data:OtpVerifyForgetDto):Promise<void>{
   
    const {email,otp} = data;
    const normalizeEmail = email.toLowerCase().trim()
    const redisKey = `forgetotp:vendor:${normalizeEmail}`
    const storedOtp = await this._redisService.get(redisKey)

    if(!storedOtp){
      logger.error({err:error},"No otp storde in the forget password functionality");
      throw new CustomError(MESSAGES.OTP_INVALID,STATUS_CODES.BAD_REQUEST)
    }

    if(storedOtp !== otp){
      logger.error({err:error},"OTP of vendor doesnot match forget password");
      throw new CustomError(MESSAGES.OTP_INVALID,STATUS_CODES.UNAUTHORIZED)
    }

    await this._redisService.delete(redisKey);
    await this._redisService.set(`verified-reset:vendor:${email}`,"true",this.OTP_TTLSECONDS)
    logger.info({email:normalizeEmail},"Forget-password OTP verified successfully")
  }
   

   async resetPassword(email: string, password: string): Promise<string> {
    const vendor = await this._vendorRepository.findByEmail(email);
    if(!vendor){
      throw new CustomError(MESSAGES.USER_NOT_FOUND)
    }

   const hashedPassword = await this._IpasswordService.hashPassword(password);
   
   await this._vendorRepository.updateVendorPassword(email,hashedPassword)
   return "Password reset successfully"
  }


 async googleLogin(googleToken:string):Promise<{accessToken:string,refreshToken:string,vendor:LoginResponseDto}>{

  const client = new OAuth2Client(env.GOOGLE_CLIENT_ID)
  const ticket = await client.verifyIdToken({idToken:googleToken,audience:env.GOOGLE_CLIENT_ID});
  const payload = ticket.getPayload()

  if(!payload || !payload.email){
    throw new CustomError(MESSAGES.EMAIL_NOT_FOUND)
  }

  const {email,name} = payload

  let vendor:IVendor |null = await this._vendorRepository.findByEmail(email)

  if(!vendor){
    const VendorData:VendorRegisterDto={
      name:name || "No name",
      email:email,
      vendorId:Math.random().toString(36).substring(2,9),
    }

    const vendorModel:Partial<IVendor>={
      vendorName:VendorData.name,
      email:VendorData.email,
      vendorId:VendorData.vendorId,
      role:Role.Vendor

    }

    vendor = await this._vendorRepository.create(vendorModel)

  }

  const vendorResponse = VendorMapper.VendorResponse(vendor)
  const accessToken= this._IJwtService.generateAccessToken(vendor._id.toString(),"vendor")
  const refreshToken = this._IJwtService.generateRefreshToken(vendor._id.toString(),"vendor")

  return {accessToken,refreshToken,vendor:vendorResponse}
 }


 async logout(refreshToken:string):Promise<void>{

  const payload = this._IJwtService.verifyToken(refreshToken,"refresh")
  if(!payload){
    throw new CustomError(MESSAGES.INVALID_REFRESH_TOKEN)
  }

  const ttlSeconds = payload.exp - Math.floor(Date.now()/1000)

  await this._redisService.blacklistRefreshToken(payload,ttlSeconds)
 }

}


