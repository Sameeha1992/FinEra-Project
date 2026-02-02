import { IJwtService } from "../../../interfaces/helper/jwt.service.interface";
import { VendorMapper } from "../../../mappers/sharedMappers/response.loginDto";
import { Role } from "../../../models/enums/enum";
import { IVendor } from "../../../models/vendor/vendor.model";
import { inject, injectable } from "tsyringe";
import { BaseLoginService } from "./baseLogin";
import { IUserRepository } from "../../../interfaces/repositories/user/userRepository.interface";
import { IPasswordService } from "../../../interfaces/helper/passwordhashService.interface";
import { LoginResponseDto } from "../../../dto/shared/login.dto";
import { IVendorRepository } from "../../../interfaces/repositories/vendor/vendor.auth";

@injectable()
export class VendorLoginService extends BaseLoginService {
  protected readonly role = Role.Vendor;

  constructor(
@inject("IVendorRepository") private vendorRepo: IVendorRepository,   
     @inject("IPasswordService") _IpasswordService: IPasswordService,
    @inject("IJwtService") _IjwtService: IJwtService
  ) {
    super(_IpasswordService, _IjwtService);
  }

  protected async findByEmail(email: string): Promise<any> {
    return this.vendorRepo.findByEmail(email);
  }
  protected toLoginResponse(vendor: IVendor): LoginResponseDto {
    return VendorMapper.VendorResponse(vendor);
  }
}
