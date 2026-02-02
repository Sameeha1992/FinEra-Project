import { MESSAGES } from "@/config/constants/message";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { IVendorProfileService } from "@/interfaces/services/vendor/vendor.profile.interface";
import { AuthenticateRequest } from "@/types/express/authenticateRequest.interface";
import { Response,NextFunction } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class VendorProfileController{
constructor(@inject("IVendorProfileService") private _ivendorProfileService:IVendorProfileService){}

getVendorProfile = async (req:AuthenticateRequest,res:Response,next:NextFunction)=>{

    try {
        
        const profile = await this._ivendorProfileService.getProfile(req.user!.id)

        return res.status(STATUS_CODES.SUCCESS).json({success:true,data:profile})
        
    } catch (error) {
        console.log(error,"this is the issue")
        console.error("Something went wrong",error)
        return next(error)
    }

}
}