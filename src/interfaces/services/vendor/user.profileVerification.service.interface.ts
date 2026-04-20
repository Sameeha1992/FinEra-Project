import { UserCompleteUpdateDto } from "@/dto/user/profile.dto";
import { UpdateUserVerificationStatusDto, VendorUserVerificationListDto } from "@/dto/vendorDto/user.profileVerification.dto";
import { Status } from "@/models/enums/enum";

export interface IUserProfileVerificationService {
  getUsersForVerification(
    page: number,
    limit: number,
  ): Promise<VendorUserVerificationListDto>;

 getUserProfileForVerification(userId: string): Promise<UserCompleteUpdateDto> 

 updateUserVerificationStatus(userId:string,status:Status):Promise<UpdateUserVerificationStatusDto>
}