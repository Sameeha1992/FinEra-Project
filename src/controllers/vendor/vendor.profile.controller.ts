import { MESSAGES } from "@/config/constants/message";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { IVendorProfileService } from "@/interfaces/services/vendor/vendor.profile.interface";
import { CustomError } from "@/middleware/errorMiddleware";
import { AuthenticateFileRequest, AuthenticateRequest } from "@/types/express/authenticateRequest.interface";
import { Request,Response,NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { success } from "zod";

@injectable()
export class VendorProfileController{
constructor(@inject("IVendorProfileService") private _ivendorProfileService:IVendorProfileService){}

getVendorProfile = async (req:AuthenticateRequest,res:Response,next:NextFunction)=>{

    try {
        
        const profile = await this._ivendorProfileService.getProfile(req.user!.id)

        return res.status(STATUS_CODES.SUCCESS).json({success:true,data:profile})
        
    } catch (error) {
       
        console.error("Something went wrong",error)
        return next(error)
    }

}

completeProfile = async (req:Request,res:Response,next:NextFunction)=>{


    const typedReq = req as AuthenticateFileRequest;

    const vendorId = typedReq.user!.id;

    const result = await this._ivendorProfileService.completeProfile(vendorId,typedReq.body,{registrationDoc:typedReq.files?.registrationDoc?.[0],licenceDoc:typedReq.files?.licenceDoc?.[0]});


    return res.status(STATUS_CODES.SUCCESS).json({success:true,message:MESSAGES.PROFILE_UPDATED,data:result})
}


getCompleteProfile = async (req:AuthenticateRequest,res:Response,next:NextFunction)=>{

    try {

        const userId = req.user?.id;


        if(!userId){
            throw new CustomError(MESSAGES.USER_NOT_FOUND)
        }

        const profileData = await this._ivendorProfileService.getCompleteProfile(userId)
        

        res.status(STATUS_CODES.SUCCESS).json({success:true,message:MESSAGES.FETCHED_USER_PROFILE_DATA_SUCCESSFULLY,data:profileData})
    } catch (error) {
            console.error("ERROR IN GET COMPLETE PROFILE:", error);

        next(error)
    }
}
}