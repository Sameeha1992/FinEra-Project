import { MESSAGES } from "@/config/constants/message";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { IAdminProfileService } from "@/interfaces/services/admin/admin.profile.interface";
import { CustomError } from "@/middleware/errorMiddleware";
import { AuthenticateRequest } from "@/types/express/authenticateRequest.interface";
import { Response,Request,NextFunction } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class AdminProfileController{
    constructor(@inject('IAdminProfileService') private _adminProfileService:IAdminProfileService){}


    async getProfile(req:AuthenticateRequest,res:Response,next:NextFunction){
     
        try {
            if(!req.user?.id){
              return res.status(STATUS_CODES.UNAUTHORIZED)
            }

            const profile = await this._adminProfileService.getAdminProfile(req.user.id)

            return res.status(STATUS_CODES.SUCCESS).json({success:true,data:profile})
            
        } catch (error) {
            console.error("Something went wrong on adminprofile",error);
            throw new CustomError(MESSAGES.SOMETHING_WENT_WRONG)
        }
    }

}