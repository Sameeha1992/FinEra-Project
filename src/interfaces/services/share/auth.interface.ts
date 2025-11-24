import { LoginDto, LoginResponseDto } from "../../../dto/shared/login.dto";

export interface IBaseLoginService {
  login(credentials: LoginDto): Promise<{
    user: LoginResponseDto;
    accessToken: string;
    refreshToken: string;
  }>;
}
