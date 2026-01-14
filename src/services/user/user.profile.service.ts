import { IUser } from "@/models/user/user.model";
import { IUserRepository } from "../../interfaces/repositories/user/userRepository.interface";
import { inject, injectable } from "tsyringe";
import { UserProfileResponseDTO } from "../../dto/user/profile.dto";
import { UserProfileMapper } from "../../mappers/user/userProfile";
import { CustomError } from "../../middleware/errorMiddleware";

@injectable()
export class UserProfileService{
    constructor(@inject("IUserRepository") private _iUserRepository:IUserRepository){}
    async getProfile(userId:string):Promise<UserProfileResponseDTO>{
     let user = await this._iUserRepository.findById(userId)
     if(!user) throw new CustomError("User not found");

     return UserProfileMapper.toResponse(user)
    }
}