import { IUserprofileService } from "../../../interfaces/services/user/user.profile.interface"
import { Response,NextFunction } from "express";
import {AuthenticatedRequest} from "../../../middleware/authMiddleware"
import { inject, injectable } from "tsyringe";
import {STATUS_CODES} from "../../../config/constants/statusCode"
import { CustomError } from "@/middleware/errorMiddleware";
import { MESSAGES } from "@/config/constants/message";


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


    async updateProfileImage(req:AuthenticatedRequest,res:Response,next:NextFunction){
        try {
            if(!req.file){
              throw new CustomError(MESSAGES.FILE_MISSING)
            }

            const userId = req.user!.userId;
            console.log(userId,"userId")
            const extension = req.file.mimetype.split("/")[1];

            const key = `profiles/${userId}.${extension}`

            const updateProfile = await this._userProfileService.updateProfileImage(userId,req.file,key)
            
          
            return res.status(STATUS_CODES.SUCCESS).json({success:true,message:MESSAGES.IMAGE_UPLOAD_SUCCESS,data:updateProfile})
        } catch (error) {
            next(error)
        }
    }
}