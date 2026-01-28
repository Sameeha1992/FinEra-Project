import { IAdminAuthService } from "../../interfaces/services/admin/admin.auth.interface";
import { inject, injectable } from "tsyringe";
import { IJwtService } from "../../interfaces/helper/jwt.service.interface";
import { LoginResponseDto, LoginDto } from "../../dto/shared/login.dto";
import { IAdminAuthRepo } from "../../interfaces/repositories/admin/admin.auth.repo.interface";
import { CustomError } from "../../middleware/errorMiddleware";
import { MESSAGES } from "../../config/constants/message";
import { UserMapper } from "../../mappers/sharedMappers/response.loginDto";
import { Role } from "../../models/enums/enum";
import { IUser } from "../../models/user/user.model";
import { IPasswordService } from "../../interfaces/helper/passwordhashService.interface";
import { IRedisService } from "@/interfaces/helper/redis.interface";

@injectable()
export class AdminAuthService implements IAdminAuthService {
  constructor(
    @inject("IJwtService") private _IJwtService: IJwtService,
    @inject("IAdminAuthRepo") private _IAdminAuthRepo: IAdminAuthRepo,
    @inject("IPasswordService") private _IPasswordService: IPasswordService,
    @inject("IRedisService") private _IRedisService:IRedisService
  ) {}

  async login(
    credentials: LoginDto
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    admin: LoginResponseDto;
  }> {
    const adminData: IUser | null = await this._IAdminAuthRepo.findByEmail(
      credentials.email
    );

    if (!adminData) {
      console.error("No admin data found", credentials.email);
      throw new CustomError(MESSAGES.NOT_FOUND);
    }

    if (!adminData.password) {
      console.error("Password not found");
      throw new CustomError(MESSAGES.PASSWORD_NOT_ALLOWED);
    }

    if (adminData.role !== "admin") {
      throw new CustomError(MESSAGES.UNAUTHORIZED_ACCESS);
    }

    const isPassword = this._IPasswordService.comparePassword(
      credentials.password,
      adminData.password
    );

    if (!isPassword) {
      throw new CustomError(MESSAGES.PASSWORD_MISMATCH);
    }

    const adminLoginResponse: LoginResponseDto =
      UserMapper.UserResponse(adminData);

    const accessToken = this._IJwtService.generateAccessToken(
      adminData._id,
      Role.Admin
    );
    const refreshToken = this._IJwtService.generateRefreshToken(
      adminData._id,
      Role.Admin
    );

    return { admin: adminLoginResponse, accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<string> {
    const decode = await this._IJwtService.verifyToken(refreshToken, "refresh");

    if (!decode) {
      throw new CustomError("Refresh token not valid");
    }
    const adminId = decode._id;
    const role = decode.role;

    return this._IJwtService.generateAccessToken(adminId, role || Role.Admin);
  }

  async logout(refreshToken:string):Promise<void>{
     const payload = this._IJwtService.verifyToken(refreshToken,"refresh")
     if(!payload){
      throw new CustomError(MESSAGES.INVALID_REFRESH_TOKEN)
     }
       const ttlSeconds = payload.exp - Math.floor(Date.now() /1000);

       await this._IRedisService.blacklistRefreshToken(payload.jti,ttlSeconds)

  }
}
