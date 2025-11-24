import { IUser } from "../../../models/user/user.model";
import { IBaseRepository } from "../baseRepository.interface";
import { IAdmin } from "../../../models/admin/admin.model";

export interface IAdminAuthRepo extends IBaseRepository<IUser>{
    
    findByEmail(email:string):Promise<IUser |null>
}