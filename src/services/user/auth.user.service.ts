import { IAuthUserService } from "../../interfaces/services/user/auth.userservice.interface";
import { userRegisterDTO } from "../../dto/user/auth/userRegisterDTO";
import { IUser } from "../../models/user.model";
import { UserRepository } from "../../repositories/user.repository";
import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../interfaces/repositories/userRepository.interface";
import { IPasswordService } from "../../interfaces/helper/passwordhashService.interface";

@injectable()
export class AuthUserService implements IAuthUserService{
    constructor(@inject ("UserRepository")private _userRepository:IUserRepository,
                @inject ("PasswordService")private _passwordService:IPasswordService){}
    async registerUser(userData: Omit<userRegisterDTO,"customerId">): Promise<IUser> {
        const existingUser = await this._userRepository.findByEmail(userData.email)
        if(existingUser){
            throw new Error("Email already exists")
        }

        if(!userData.password){
            throw new Error("Password is required")
        }

        userData.password = await this._passwordService.hashPassword(userData.password)

        const UserData: userRegisterDTO = {
            ...userData,
            customerId:Math.random().toString(36).substring(2,9)
        }
       
     return this._userRepository.create(UserData)
    }

}