import { IUserRepository } from "../../interfaces/repositories/user/userRepository.interface";
import { inject, injectable } from "tsyringe";
import { UserProfileResponseDTO } from "../../dto/user/profile.dto";
import { UserProfileMapper } from "../../mappers/user/userProfile";
import { CustomError } from "../../middleware/errorMiddleware";
import { MESSAGES } from "@/config/constants/message";
import { IStorageService } from "@/interfaces/helper/storageService.interface";

@injectable()
export class UserProfileService{
    constructor(@inject("IUserRepository") private _iUserRepository:IUserRepository,
                  @inject("IStorageService") private _IStorageService:IStorageService){}

    async getProfile(userId:string):Promise<UserProfileResponseDTO>{
     let user = await this._iUserRepository.findById(userId)
     if(!user) throw new CustomError(MESSAGES.USER_NOT_FOUND);

     return UserProfileMapper.toResponse(user)
    }


    async updateProfileImage(userId:string,image:Express.Multer.File):Promise<UserProfileResponseDTO>{

        const user = await this._iUserRepository.findById(userId);
        if(!user) throw new CustomError(MESSAGES.USER_NOT_FOUND)

            let extensions = image.mimetype.split("/")[1]

            let key = `profiles/${userId}.${extensions}`
            
            const updateUser = await this._iUserRepository.updateById(userId,{
                profileImage:key
            })

            if(!updateUser){
                throw new CustomError(MESSAGES.USER_NOT_FOUND)
            }

            return UserProfileMapper.toResponse(updateUser)
    }


}