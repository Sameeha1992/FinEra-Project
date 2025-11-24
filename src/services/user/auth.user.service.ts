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
} from "../../dto/user/auth/otp-generation.dto";
import logger from "../../middleware/loggerMiddleware";
import { redisClient } from "../../config/redis/redis.connect";
import { LoginDto, LoginResponseDto } from "../../dto/shared/login.dto";
import { IJwtService } from "../../interfaces/helper/jwt.service.interface";
import { CustomError } from "../../middleware/errorMiddleware";
import { MESSAGES } from "../../config/constants/message";
import { IRedisService } from "../../interfaces/services/redis.interface";
import { UserMapper } from "../../mappers/sharedMappers/response.loginDto";
import { Role } from "../../models/enums/enum";

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
      console.log("existed aanu");

      throw new CustomError(MESSAGES.EMAIL_ALREADY_USED);
    }
    console.log("ivide nd");
    console.log(await this._redisService.get(`verified:user:${email}`));
    const isVerified = await this._redisService.get(`verified:user:${email}`);
    if (!isVerified) {
      console.log("Here the issue is");
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
      console.log("completed");
      const content = this._emailService.generateOtpEmailContent(Number(otp));
      const subject = "Your OTP Code";
      await this._emailService.sendEmail(normalizedEmail, subject, content);

      logger.debug(`OTP for ${normalizedEmail}: ${otp}`);
      console.log(otp);
      logger.info(`OTP generated and sent to ${normalizedEmail}`);

      return {
        email: normalizedEmail,
        otp: otp,
        expireAt,
      };
    } catch (error: any) {
      logger.error(`Failed to generate OTP for ${email}:`, {
        message: error.message,
      });

      throw new Error("Failed to send OTP. Please try again.");
    }
  }

  //Verify OTP

  async verifyOtp(otpData: OtpVerifyDto): Promise<void> {
    const { email, otp } = otpData;
    console.log(email);
    console.log(otp);

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

      console.log("StoredOTP vare varum");
      const storedOTP = await this._redisService.get(`otp:${normalizedEmail}`);
      console.log("store otp chythu", storedOTP);
      if (!storedOTP) {
        console.log("❌ No OTP found in database for email:", normalizedEmail);

        throw new Error("OTP expired or invalid");
      }

      console.log("result", storedOTP === String(otp));
      if (storedOTP !== String(otp)) {
        throw new Error("Invalid otp");
      }

      await this._redisService.delete(`otp:${normalizedEmail}`);
      await this._redisService.markUserVerified(
        normalizedEmail,
        "user",
        this.OTP_TTLSECONDS
      );

      logger.info(`OTP verified successfully for ${normalizedEmail}`);
    } catch (error: any) {
      logger.error(`OTP verification failed for ${email}:`, error.message);
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
      console.log("No user found", credentials.email);
      throw new CustomError(MESSAGES.USER_NOT_FOUND);
    }
    console.log("User found", userData.email);

    if (!userData.password) {
      console.log("no passwordlogin");
      throw new CustomError(MESSAGES.PASSWORD_NOT_REQUIRED);
    }

    const isPassword: boolean = await this._passwordService.comparePassword(
      credentials.password,
      userData.password
    );
    console.log("Password is matching correct", isPassword);

    if (!isPassword) {
      console.log("password is mismatching wrong credentials");
      throw new CustomError(MESSAGES.PASSWORD_MISMATCH);
    }
    console.log("Password is matching correct credentials");
    console.log(userData._id);

    const loginResponse: LoginResponseDto = UserMapper.UserResponse(userData);

    const accessToken = this._jwtService.generateAccessToken(
      userData._id,
      "user"
    );
    console.log("Access token generate cheythu");
    const refreshToken = this._jwtService.generateRefreshToken(
      userData._id,
      "user"
    );
    console.log("refresh and access token sheriyai");
    return { user: loginResponse, accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<string> {
    const decoded = await this._jwtService.verifyToken(refreshToken, "refresh");

    if (!decoded) {
      throw new CustomError("Refresh token not valid");
    }

    const userId = decoded._id;
    const role = decoded.role;

    return this._jwtService.generateAccessToken(userId, role || Role.User);
  }
}
