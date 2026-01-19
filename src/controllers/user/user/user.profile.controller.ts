import { IUserprofileService } from "../../../interfaces/services/user/user.profile.interface"
import { Response,NextFunction } from "express";
import {AuthenticatedRequest} from "../../../middleware/authMiddleware"
import { inject, injectable } from "tsyringe";
import {STATUS_CODES} from "../../../config/constants/statusCode"


@injectable()
export class UserProfileController{
    constructor(@inject('IUserProfileService') private _userProfileService:IUserprofileService){}

    async getProfile(req:AuthenticatedRequest,res:Response,next:NextFunction){
        try {

            if(!req.user?.userId){
                return res.status(401).json({message:"Unauthorized"})
            }

            const profile = await this._userProfileService.getProfile(req.user.userId)
            
            return res.status(STATUS_CODES.SUCCESS).json({success:true,data:profile})
        } catch (error) {
            console.error("Something went wrong on profile",error)
        }
    }
}