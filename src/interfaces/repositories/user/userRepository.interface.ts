import { IUser } from "../../../models/user/user.model";
import { IBaseRepository } from "../baseRepository.interface";


export interface IUserRepository extends IBaseRepository<IUser>{

    findByEmail(email:string):Promise<IUser | null>;
}