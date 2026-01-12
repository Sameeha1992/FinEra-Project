import { IUserprofileService } from "@/interfaces/services/user/user.profile.interface";
import { Request,Response,NextFunction } from "express";
import { inject } from "tsyringe";

export class userProfileController{
    constructor(@inject('IUserprofileService') private _userProfileService:IUserprofileService){}

    async getProfile(req:Request,res:Response,next:NextFunction){
        try {
            const userId = req.user?.id

            
        } catch (error) {
            
        }
    }
}