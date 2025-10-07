import { Request,Response,NextFunction } from "express";
import { userRegisterDTO } from "../../dto/user/auth/userRegisterDTO";
import {IAuthUserService} from "../../interfaces/services/user/auth.userservice.interface"
import { injectable,inject } from "tsyringe";

@injectable()
export class AuthUserController{
constructor(@inject("AuthUserService") private _authUserService:IAuthUserService
){}

async register(req:Request,res:Response,next:NextFunction){
    try {
        const userData:userRegisterDTO = req.body;
        const createUser = await this._authUserService.registerUser(userData)
        res.status(201).json({success:true,data:createUser})
    } catch (error) {
        next(error)
    }
}


}