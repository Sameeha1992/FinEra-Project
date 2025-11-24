import { injectable } from "tsyringe";
import { IUserRepository } from "../../interfaces/repositories/user/userRepository.interface";
import { IUser,UserModel } from "../../models/user/user.model";
import { BaseRepository } from "../base_repository";


 @injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository{
    constructor(){
        super(UserModel)
    }
    async findByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({email})
    }
    
}

