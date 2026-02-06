import { UserCompletedResponseDto, UserCompleteProfileDto, UserCompleteUpdateDto, UserProfileResponseDTO } from "@/dto/user/profile.dto";

export interface IUserprofileService{
    getProfile(userId:string):Promise<UserProfileResponseDTO>
    updateProfileImage(userId:string,image:Express.Multer.File,key:string):Promise<UserProfileResponseDTO>
    completeProfile(userId:string,dto:UserCompleteProfileDto,files:{adhaarDoc?:Express.Multer.File,panDoc?:Express.Multer.File;cibilDoc?:Express.Multer.File}):Promise<UserCompletedResponseDto>
    getCompleteProfile(userId:string):Promise<UserCompleteUpdateDto>
}