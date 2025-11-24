import { MESSAGES } from "../../config/constants/message";
import {
  VendorRegisterDto,
  VendorResponseDto,
} from "../../dto/vendorDto/vendor.auth.dto";
import { IVendorAuthRepository } from "../../interfaces/repositories/vendor/vendor.auth";
import { IVendorAuthService } from "../../interfaces/services/vendor/vendor.auth.service.interface";
import { CustomError } from "../../middleware/errorMiddleware";
import { vendorAuthRepository } from "../../repositories/vendor/vendor.auth.repo";
import { IRedisService } from "../../interfaces/services/redis.interface";
import { inject, injectable } from "tsyringe";
import { IPasswordService } from "../../interfaces/helper/passwordhashService.interface";
import { vendorRegisterMapper } from "../../mappers/vendor/vendor.register.mapper";
import { IOtp } from "../../interfaces/helper/otp.Interface";
import { IEmailService } from "../../interfaces/helper/email.sevice.interface";
import logger from "../../middleware/loggerMiddleware";
import { OtpVerifyDto } from "../../dto/user/auth/otp-generation.dto";
import { LoginDto, LoginResponseDto } from "../../dto/shared/login.dto";
import { IVendor } from "../../models/vendor/vendor.model";
import { UserMapper, VendorMapper } from "../../mappers/sharedMappers/response.loginDto";
import { IVendorLoginService } from "../../interfaces/services/share/auth.vendor.interface";
import { IUserRepository } from "../../interfaces/repositories/user/userRepository.interface";
import { STATUS_CODES } from "../../config/constants/statusCode";
import { IJwtService } from "../../interfaces/helper/jwt.service.interface";
import { Role } from "../../models/enums/enum";
@injectable()
export class VendorAuthService implements IVendorAuthService {
  private readonly OTP_TTLSECONDS = 10 * 60;
  constructor(
    @inject("IVendorAuthRepository") private _vendorRepository: IVendorAuthRepository,
    @inject("IRedisService") private _redisService: IRedisService,
    @inject("IPasswordService") private _IpasswordService: IPasswordService,
    @inject("IEmailService") private _emailService: IEmailService,
    @inject("IJwtService") private _IJwtService:IJwtService
  ) {}

  async vendorRegister(dto: VendorRegisterDto): Promise<VendorResponseDto> {
    try {
      const email = dto.email.toLowerCase().trim();
      console.log("email on vendor", email);
      const existingVendor = await this._vendorRepository.findByEmail(
        email
      );

      console.log(existingVendor, "vendor email");
      if (existingVendor) {
        console.log("Venodr is existing");

        throw new CustomError(MESSAGES.USER_ALREADY_EXISTS);
      }

      const isVerified = await this._redisService.isUserVerified(
        email,
        "vendor"
      );

      console.log(isVerified, "isVerified on vendor");
      if (!isVerified) {
        console.log("The otp not verified properly");

        throw new CustomError(MESSAGES.OTP_NOT_VERIFIED);
      }

      if (!dto.password) {
        console.log("password not required");
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
      console.log("otp coming from the evndor side");
      const content = this._emailService.generateOtpEmailContent(Number(otp));
      const subject = "Vendor OTP Code";
      await this._emailService.sendEmail(
        normalizedEmail,
        "Vendor OTP Code",
        content
      );

      logger.debug(`Vendor OTP for ${normalizedEmail} : ${otp}`);
      console.log(otp);
      logger.info(`Otp generated and send to ${normalizedEmail}`);

      return { email: normalizedEmail, otp: otp, expireAt };
    } catch (error: any) {
      logger.error(`Failed to generate OTP for ${email}:`, {
        message: error.message,
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
      logger.info(`OTP verified for ${normalizedEmail}`);
      return true;
    } catch (error: any) {
      logger.error("OTP verification failed", {
        email: vendorData.email,
        error: error.message,
        stack: error.stack,
      });
      return false;
    }

    
  }

  async vendorLogin(credentials: LoginDto): Promise<{ vendor: LoginResponseDto; accessToken: string; refreshToken: string; }> {
    const vendorData:IVendor|null = await this._vendorRepository.findByEmail(credentials.email);

    console.log(vendorData,"vendorData from service")
    if(!vendorData){
      console.log("No vendors found with this email",credentials.email)
      throw new CustomError(MESSAGES.USER_NOT_FOUND,STATUS_CODES.BAD_REQUEST)
    }

    console.log("data vendor und")

    if(!vendorData.password){
      console.log("No Vendor password found");
      throw new CustomError(MESSAGES.PASSWORD_NOT_REQUIRED,STATUS_CODES.BAD_REQUEST)
    }

    const isPassword:boolean = await this._IpasswordService.comparePassword(credentials.password,vendorData.password);

    if(!isPassword){
      console.log("password of vendor is mismatching");
      throw new CustomError(MESSAGES.PASSWORD_MISMATCH,STATUS_CODES.NOT_FOUND)
    }

    const loginResponse:LoginResponseDto = VendorMapper.VendorResponse(vendorData);

    const accessToken = this._IJwtService.generateAccessToken(vendorData.vendorId,"vendor");
    console.log("AccessData for vendor generated")
    const refreshToken = this._IJwtService.generateRefreshToken(vendorData.vendorId,"vendor");
    console.log("Refresh Token has been genearted")

    return {vendor:loginResponse,accessToken,refreshToken}

  }

  async refreshToken(refreshToken:string):Promise<string>{
    const decode = await this._IJwtService.verifyToken(refreshToken,"refresh");
    if(!decode){
      throw new CustomError(MESSAGES.INVALID_REFRESH_TOKEN,STATUS_CODES.NOT_FOUND)
    }

    const vendorId = decode._id;
    const role = decode.role;

    return this._IJwtService.generateAccessToken(vendorId,role||Role.Vendor
    )
  }
  
   
}


