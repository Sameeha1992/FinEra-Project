import { IUser } from "../../models/user/user.model";
import { IAdmin } from "../../models/admin/admin.model";

import { LoginDto, LoginResponseDto } from "../../dto/shared/login.dto";
import { Role } from "../../models/enums/enum";
import { IVendor } from "../../models/vendor/vendor.model";

export class UserMapper {
  static UserResponse(user: IUser): LoginResponseDto {
    return {
      name: user.name,
      email: user.email,
      role: user.role ?? Role.User,
      Id: user.customerId ?? user._id.toString(),
    };
  }
}

export class VendorMapper {
  static VendorResponse(vendor: IVendor): LoginResponseDto {
    return {
      name: vendor.vendorName,
      email: vendor.contact_email,
      role: Role.Vendor,
      Id: vendor.vendorId ?? vendor._id.toString(),
    };
  }
}

// export class UserRegisterMapper{
//     static RegisterUserResponse(user:IUser):RegisterResponseDto{
//         return{
//             name:user.name,
//             email:user.email,
//             password:user.password,
//             customerId:user.customerId,

//         }
//     }
//}
