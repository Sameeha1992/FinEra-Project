import { IAuthUserService } from "../../interfaces/services/user/auth.userservice.interface";
import { UserRegisterDTO } from "../../dto/user/auth/userRegisterDTO";
import { IUser } from "../../models/user/user.model";
import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../interfaces/repositories/user/userRepository.interface";
import { IPasswordService } from "../../interfaces/helper/passwordhashService.interface";
import { IEmailService } from "../../interfaces/helper/email.sevice.interface";
import { IOtp } from "../../interfaces/helper/otp.Interface";
import {
  otpgenerateDto,
  OtpVerifyDto,
  OtpVerifyForgetDto,
} from "../../dto/user/auth/otp-generation.dto";
import logger from "../../middleware/loggerMiddleware";
import { LoginDto, LoginResponseDto } from "../../dto/shared/login.dto";
import { IJwtService } from "../../interfaces/helper/jwt.service.interface";
import { CustomError } from "../../middleware/errorMiddleware";
import { MESSAGES } from "../../config/constants/message";
import { IRedisService } from "../../interfaces/helper/redis.interface";
import { UserMapper } from "../../mappers/sharedMappers/response.loginDto";
import { Role } from "../../models/enums/enum";
import { STATUS_CODES } from "../../config/constants/statusCode";
import { error } from "console";
import { OAuth2Client } from "google-auth-library";
import { env } from "process";

@injectable()
export class AuthUserService implements IAuthUserService {
  private readonly OTP_TTLSECONDS = 10 * 60;
  constructor(
    @inject("IUserRepository") private _userRepository: IUserRepository,
    @inject("IPasswordService") private _passwordService: IPasswordService,
    @inject("IRedisService") private _redisService: IRedisService,
    @inject("IEmailService") private _emailService: IEmailService,
    @inject("IJwtService") private _jwtService: IJwtService
  ) {}

  async registerUser(
    userData: Omit<UserRegisterDTO, "customerId">
  ): Promise<IUser> {
    const email = userData.email;

    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser) {

      throw new CustomError(MESSAGES.EMAIL_ALREADY_USED);
    }
    const isVerified = await this._redisService.get(`verified:user:${email}`);
    if (!isVerified) {
      throw new CustomError(MESSAGES.OTP_NOT_VERIFIED);
    }

    if (!userData.password) {
      throw new CustomError("Password is required");
    }

    const hashedPassword = await this._passwordService.hashPassword(
      userData.password
    );

    const userRegisterData: UserRegisterDTO = {
      ...userData,
      email,
      password: hashedPassword,
      customerId: Math.random().toString(36).substring(2, 9),
    };

    await this._redisService.delete(`verified:${email}`);

    return this._userRepository.create(userRegisterData);
  }

  //Generate OTP

  async generateOtp(email: string): Promise<IOtp> {
    try {
      const normalizedEmail = email.toLowerCase().trim();

      if (!normalizedEmail) {
        throw new Error("Invalid email format");
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const expireAt = new Date(Date.now() + this.OTP_TTLSECONDS * 1000);
      const redisKey = `otp:${normalizedEmail}`;

      await this._redisService.set(redisKey, otp, this.OTP_TTLSECONDS);
      const content = this._emailService.generateOtpEmailContent(Number(otp));
      const subject = "Your OTP Code";
      await this._emailService.sendEmail(normalizedEmail, subject, content);

      logger.debug({normalizedEmail,otp},"OTP generated and sent successfully");
      logger.info({normalizedEmail},`OTP generated and sent to`);

      return {
        email: normalizedEmail,
        otp: otp,
        expireAt,
      };
    } catch (error: any) {
      logger.error({err:error,email},"Failed to generate OTP")

      throw new Error("Failed to send OTP. Please try again.");
    }
  }

  //Verify OTP

  async verifyOtp(otpData: OtpVerifyDto): Promise<void> {
    const { email, otp } = otpData;

    try {
      const normalizedEmail = email.toLowerCase().trim();

      console.log("Reciedved OTP verification req:", { email, otp });

      console.log("normalise email", normalizedEmail);
      if (!normalizedEmail) {
        throw new Error("Invalid email format");
      }

      if (!otp || otp.length !== 6) {
        throw new Error("OTP must me 6 digits");
      }

      const storedOTP = await this._redisService.get(`otp:${normalizedEmail}`);
      console.log("store otp chythu", storedOTP);
      if (!storedOTP) {

        throw new Error("OTP expired or invalid");
      }

      if (storedOTP !== String(otp)) {
        throw new Error("Invalid otp");
      }

      await this._redisService.delete(`otp:${normalizedEmail}`);
      await this._redisService.markUserVerified(
        normalizedEmail,
        "user",
        this.OTP_TTLSECONDS
      );

      logger.info({normalizedEmail},`OTP verified successfully`);
    } catch (error: any) {
      logger.error({err:error,email},`OTP verification failed`);
      throw error;
    }
  }

  // Login

  async Login(credentials: LoginDto): Promise<{
    user: LoginResponseDto;
    accessToken: string;
    refreshToken: string;
  }> {
    const userData: IUser | null = await this._userRepository.findByEmail(
      credentials.email
    );

    if (!userData) {
      throw new CustomError(MESSAGES.USER_NOT_FOUND);
    }

    if (!userData.password) {
      throw new CustomError(MESSAGES.PASSWORD_NOT_REQUIRED);
    }

    const isPassword: boolean = await this._passwordService.comparePassword(
      credentials.password,
      userData.password
    );

    if (!isPassword) {
      logger.error({err:error},"Password does not math")
      throw new CustomError(MESSAGES.PASSWORD_MISMATCH);
    }
    

    const loginResponse: LoginResponseDto = UserMapper.UserResponse(userData);

    const accessToken = this._jwtService.generateAccessToken(
      userData._id,
      "user"
    );
    const refreshToken = this._jwtService.generateRefreshToken(
      userData._id,
      "user"
    );
    return { user: loginResponse, accessToken, refreshToken };
  }

  //Refresh Token:-

  async refreshToken(refreshToken: string): Promise<{accessToken:string,refreshToken:string}> {
    const decoded = await this._jwtService.verifyToken(refreshToken, "refresh");

    if (!decoded) {
      throw new CustomError("Refresh token not valid");
    }

    const isBlacklisted = await this._redisService.isRefreshTokenBlacklisted(decoded.jti);

    if(isBlacklisted){
      throw new CustomError("Refresh token revoked")
    }

    const ttlSeconds = decoded.exp - Math.floor(Date.now() /1000);

    if(ttlSeconds >0){
      await this._redisService.blacklistRefreshToken(decoded.jti,ttlSeconds);
    }

    const newAccessToken = this._jwtService.generateAccessToken(decoded._id,decoded.role)
    const newRefreshToken = this._jwtService.generateRefreshToken(decoded._id,decoded.role)
    

    return {
      accessToken:newAccessToken,
      refreshToken:newRefreshToken
    }
  }

  //Forget Password:-

  async forgetPassword(email:string):Promise<string>{
    const user = await this._userRepository.findByEmail(email);
    if(!user){
      logger.error("User not found in forget password")
      throw new CustomError(MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
    }

    const otp = Math.floor(100000 +Math.random() * 900000).toString();

    const redisKey = `forgetotp:user:${email}`

    await this._redisService.set(redisKey,otp,this.OTP_TTLSECONDS);

    const content = this._emailService.generateOtpEmailContent(Number(otp)) 
    const subject = "Your OTP is here"
    await this._emailService.sendEmail(email,subject,content,)


    logger.info({email,otp},"Otp generated for forget password")
    return "OTP send successfully"
                       
  }

  async verifyforgetOtp(data:OtpVerifyForgetDto):Promise<void>{
    const {email,otp} = data;
    const normaliseEmail = email.toLowerCase().trim()
    const redisKey = `forgetotp:user:${normaliseEmail}`
    const storedOtp = await this._redisService.get(redisKey);
    if(!storedOtp){
      logger.error({err:error},"No OTP stored in forget password functionality")
      throw new CustomError(MESSAGES.OTP_INVALID,STATUS_CODES.BAD_REQUEST)
    }

    if(storedOtp!==otp){
      logger.error({err:error},"OTP does not match-forget password")
     throw new CustomError(MESSAGES.OTP_INVALID,STATUS_CODES.UNAUTHORIZED)
    }

    await this._redisService.delete(redisKey);
    await this._redisService.set(`verified-reset:user:${email}`,"true",this.OTP_TTLSECONDS)
  logger.info({email:normaliseEmail},"Forget-password OTP verified successfully")

  }

  async resetPassword(email: string, password: string): Promise<string> {
    const user = await this._userRepository.findByEmail(email);
    if(!user){
      throw new CustomError(MESSAGES.USER_NOT_FOUND)
    }

   const hashedPassword = await this._passwordService.hashPassword(password);
   
   await this._userRepository.updatePassword(email,hashedPassword)
   return "Password reset successfully"
  }

  async googleLogin(googleToken:string):Promise<{accessToken:string,refreshToken:string,user:LoginResponseDto}>{
     const client = new OAuth2Client(env.GOOGLE_CLIENT_ID)
     const ticket = await client.verifyIdToken({idToken:googleToken,audience:env.GOOGLE_CLIENT_ID})
     const payload= ticket.getPayload()

     if(!payload || !payload.email){
      throw new CustomError(MESSAGES.EMAIL_NOT_FOUND)
     }

     const {email,name} = payload

     let user:IUser |null = await this._userRepository.findByEmail(email)
     if(!user){
      const UserData:UserRegisterDTO = {
        name:name||"No name",
        email:email,
        customerId:Math.random().toString(36).substring(2,9),
     }

const userModel:Partial<IUser>={
  name:UserData.name,
  email:UserData.email,
  customerId:UserData.customerId,
  role:Role.User                                                                                                                                                                                                                                                                                                                                                                                                                                                       
}

user = await this._userRepository.create(userModel)
  }

  const userResponse = UserMapper.UserResponse(user)
  const accessToken = this._jwtService.generateAccessToken(user._id,"user");
  const refreshToken = this._jwtService.generateRefreshToken(user._id,"user");

  return {accessToken,refreshToken,user:userResponse}

}


async logout(refreshToken:string):Promise<void>{
  const payload = this._jwtService.verifyToken(refreshToken,"refresh")
  if(!payload){
    throw new CustomError(MESSAGES.INVALID_REFRESH_TOKEN);
  }

  const ttlSeconds = payload.exp - Math.floor(Date.now() /1000);

  await this._redisService.blacklistRefreshToken(payload.jti,ttlSeconds)
}

}
