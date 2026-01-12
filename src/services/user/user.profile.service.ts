// import { IUser } from "@/models/user/user.model";
// import { IUserRepository } from "../../interfaces/repositories/user/userRepository.interface";
// import { inject } from "tsyringe";
// import { UserProfileResponseDTO } from "@/dto/user/profile.dto";
// import { UserProfileMapper } from "@/mappers/user/userProfile";

// export class userProfileService{
//     constructor(@inject("IUserRepository") private _iUserRepository:IUserRepository){}
//     async getProfile(userId:string):Promise<UserProfileResponseDTO|null>{
//      let user = await this._iUserRepository.findById(userId)
//      if(!user)return null;

//      return UserProfileMapper.toResponse(user)
//     }
// }