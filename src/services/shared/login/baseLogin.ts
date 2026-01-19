import { MESSAGES } from "../../../config/constants/message";
import { STATUS_CODES } from "../../../config/constants/statusCode";
import { LoginDto, LoginResponseDto } from "../../../dto/shared/login.dto";
import { IJwtService } from "../../../interfaces/helper/jwt.service.interface";
import { IPasswordService } from "../../../interfaces/helper/passwordhashService.interface";
import { IBaseLoginService } from "../../../interfaces/services/share/auth.interface";
import { CustomError } from "../../../middleware/errorMiddleware";
import { Role } from "../../../models/enums/enum";
import { inject } from "tsyringe";

export abstract class BaseLoginService implements IBaseLoginService {
  protected abstract readonly role: Role;
  protected abstract findByEmail(email: string): Promise<any>;
  protected abstract toLoginResponse(entity: any): LoginResponseDto;

  constructor(
    @inject("IPasswordService") protected _passwordService: IPasswordService,
    @inject("IJwtService") protected _IjwtService: IJwtService
  ) {}

  public async login(credentials: LoginDto): Promise<{
    user: LoginResponseDto;
    accessToken: string;
    refreshToken: string;
  }> {
    const { email, password } = credentials;

    const entity = await this.findByEmail(email.toLowerCase().trim());

    if (!entity) {
      throw new CustomError(MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    if (!entity.password) {
      throw new CustomError(
        MESSAGES.PASSWORD_NOT_REQUIRED,
        STATUS_CODES.BAD_REQUEST
      );
    }

    const isValid = await this._passwordService.comparePassword(
      password,
      entity.password
    );

    if (!isValid) {
      throw new CustomError(
        MESSAGES.PASSWORD_MISMATCH,
        STATUS_CODES.UNAUTHORIZED
      );
    }

    const loginResponse = this.toLoginResponse(entity);

    const accessToken = this._IjwtService.generateAccessToken(
      entity._id,
      this.role
    );
    const refreshToken = this._IjwtService.generateRefreshToken(
      entity._id,
      this.role
    );

    return {
      user: loginResponse,
      accessToken,
      refreshToken,
    };
  }
}
