import { UserProfileResponseDTO } from "@/dto/user/profile.dto";

export interface IUserprofileService{
    getProfile(userId:string):Promise<UserProfileResponseDTO>
}