import { UpdateUserVerificationStatusDto, VendorUserVerificationItemDto } from "@/dto/vendorDto/user.profileVerification.dto";
import { Status } from "@/models/enums/enum";
import { IUser } from "@/models/user/user.model";

export class VendorUserMapper {
  static toVerificationDto(user: IUser): VendorUserVerificationItemDto {
    return {
     userId: user._id.toString(),
     customerId:user.customerId,
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      status: user.status ?? Status.Not_Verified,
      createdAt: user.createdAt ?? new Date(),
    };
  }

  static toUpdateUserVerificationStatusDto(
  user: IUser,
): UpdateUserVerificationStatusDto {
  return {
    userId: user._id.toString(),
    status: user.status!,
  };
}
}



