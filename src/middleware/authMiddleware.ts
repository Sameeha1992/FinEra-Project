import { env } from "@/validations/envValidation";
import { STATUS_CODES } from "../config/constants/statusCode";
import { Request,Response,NextFunction } from "express"
import jwt,{JwtPayload} from "jsonwebtoken"
import { MESSAGES } from "@/config/constants/message";


export interface AuthenticatedRequest extends Request{
 user?: {
    userId: string;
    role?: string;
    email?: string;
  };
}

export const authenticateUser=(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    try {
        const token = req.cookies?.userAccessToken;
        if(!token){
            res.status(STATUS_CODES.UNAUTHORIZED).json({success:false,message:"Access denied.No token provided"});
            return 
        }

        const decoded = jwt.verify(token,env.JWT_ACCESS_SECRET as string)as JwtPayload & { _id: string; role?: string; email?: string };

      req.user = {
      userId: decoded._id,
      role: decoded.role,
      email: decoded.email,
    };
        next()
    } catch (error) {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({success:false,message:MESSAGES.INVALID_ACCESS_TOKEN})
    }
}