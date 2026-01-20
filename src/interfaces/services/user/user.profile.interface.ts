import { UserProfileResponseDTO } from "@/dto/user/profile.dto";

export interface IUserprofileService{
    getProfile(userId:string):Promise<UserProfileResponseDTO>
    updateProfileImage(userId:string,image:Express.Multer.File,key:string):Promise<UserProfileResponseDTO>
}