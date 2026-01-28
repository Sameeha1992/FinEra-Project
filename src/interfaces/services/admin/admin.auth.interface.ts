import { LoginResponseDto, LoginDto } from "../../../dto/shared/login.dto";

export interface IAdminAuthService {
  login(
    credentials: LoginDto
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    admin: LoginResponseDto;
  }>;
  refreshToken(resfreshToken: string): Promise<string>;

  logout(refreshToken:string):Promise<void>
}
