import { LoginDto } from "../../../dto/shared/login.dto";
import { LoginResponseDto } from "../../../dto/shared/login.dto";

export interface IVendorLoginService {
  login(credentials: LoginDto): Promise<{
    user: LoginResponseDto;
    accessToken: string;
    refreshToken: string;
  }>;
}