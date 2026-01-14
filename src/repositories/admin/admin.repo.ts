import { IAdminAuthRepo } from "../../interfaces/repositories/admin/admin.auth.repo.interface";
import { BaseRepository } from "../base_repository";
import { IUser, UserModel } from "../../models/user/user.model";



export class AdminAuthRepo extends BaseRepository<IUser> implements IAdminAuthRepo{
    constructor(){
        super(UserModel)
    }
   async findByEmail(email: string): Promise<IUser |null> {
       return await this.model.findOne({email})
   }

}