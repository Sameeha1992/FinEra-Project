import { Role } from "../../../models/enums/enum";
import { BaseLoginService } from "./baseLogin";
import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../../interfaces/repositories/user/userRepository.interface";
import { IPasswordService } from "../../../interfaces/helper/passwordhashService.interface";
import { IJwtService } from "../../../interfaces/helper/jwt.service.interface";
import { LoginResponseDto } from "../../../dto/shared/login.dto";
import {
  UserMapper
} from "../../../mappers/sharedMappers/response.loginDto";
import { IUser } from "../../../models/user/user.model";

@injectable()
export class UserLoginService extends BaseLoginService {
  protected readonly role = Role.User;

  constructor(
    @inject("IUserRepository") private _IuserRepository: IUserRepository,
    @inject("IPasswordService") _IpasswordService: IPasswordService,
    @inject("IJwtService") _IjwtService: IJwtService
  ) {
    super(_IpasswordService, _IjwtService);
  }

  protected async findByEmail(email: string): Promise<any> {
    return this._IuserRepository.findByEmail(email);
  }

  protected toLoginResponse(user: IUser): LoginResponseDto {
    return UserMapper.UserResponse(user);
  }
}
