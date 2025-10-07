import {userRegisterDTO} from "../../../dto/user/auth/userRegisterDTO"
import { IUser } from "../../../models/user.model"

export interface IAuthUserService{
    registerUser(userData:userRegisterDTO):Promise<IUser>;
}