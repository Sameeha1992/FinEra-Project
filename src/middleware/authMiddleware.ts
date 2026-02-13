// import { env } from "@/validations/envValidation";
// import { STATUS_CODES } from "../config/constants/statusCode";
// import { Request,Response,NextFunction } from "express"
// import jwt,{JwtPayload} from "jsonwebtoken"
// import { MESSAGES } from "@/config/constants/message";
// import { Role } from "@/models/enums/enum";

import { MESSAGES } from "@/config/constants/message";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { IJwtService } from "@/interfaces/helper/jwt.service.interface";
import { IUserRepository } from "@/interfaces/repositories/user/userRepository.interface";
import { IVendorRepository } from "@/interfaces/repositories/vendor/vendor.auth";
import { Role } from "@/models/enums/enum";
import { UserModel } from "@/models/user/user.model";
import { VendorModel } from "@/models/vendor/vendor.model";
import { AuthenticateRequest } from "@/types/express/authenticateRequest.interface";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

// export interface AuthenticatedRequest extends Request{
//  user?: {
//     id: string;
//     role?: Role
//     email?: string;
//   };
// }

// export const authenticateUser=(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
//     try {
//         const token = req.cookies?.accessToken;
//         if(!token){
//             res.status(STATUS_CODES.UNAUTHORIZED).json({success:false,message:"Access denied.No token provided"});
//             return
//         }

//         const decoded = jwt.verify(token,env.JWT_ACCESS_SECRET as string)as JwtPayload & { _id: string; role?: string; email?: string };

//       req.user = {
//       id: decoded._id,
//       role: decoded.role,
//       email: decoded.email,
//     };
//         next()
//     } catch (error) {
//         return res.status(STATUS_CODES.UNAUTHORIZED).json({success:false,message:MESSAGES.INVALID_ACCESS_TOKEN})
//     }
// }

@injectable()
export class AuthMiddleware {
  constructor(
    @inject("IJwtService") private _jwtService: IJwtService,
    @inject("IUserRepository") private _IUserRepository: IUserRepository,
    @inject("IVendorRepository")
    private _IVendorRepository: IVendorRepository,
  ) {}
  auntenticate = (
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ) => {
    console.log("is authenticated")
    const authHeader = req.headers.authorization;

    console.log(authHeader,"adminside")
    if(!authHeader || !authHeader.startsWith("Bearer ")){
      return res.status(STATUS_CODES.UNAUTHORIZED).json({success:false,message:MESSAGES.UNAUTHORIZED_ACCESS})
    }
   
    const token = authHeader.split(" ")[1]

    try {
      const decode = this._jwtService.verifyToken(
        token,
        "access",
      ) as JwtPayload & { _id: string; role: Role; email?: string };

      req.user = {
        id: decode._id,
        role: decode.role,
        email: decode.email,
      };
      console.log("Token User",req.user)
      

      next();
    } catch (error) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ success: false, message: MESSAGES.INVALID_ACCESS_TOKEN });
    }
  };

  //Role based authorization:-

  allowRoles = (...roles: Role[]) => {
    return (req: AuthenticateRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ success: false, message: MESSAGES.UNAUTHORIZED_ACCESS });
      }

      if (!roles.includes(req.user.role)) {
        return res
          .status(STATUS_CODES.FORBIDDEN)
          .json({ success: false, message: MESSAGES.ACCESS_DENIED });
      }
      next();
    };
  };


  //BLOCKED USERS:-
  
  checkBlocked = async (
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const { id, role } = req.user || {};

    if (!id || !role) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ success: false, message: MESSAGES.UNAUTHORIZED_ACCESS });
    }

    const model = role === Role.Vendor ? VendorModel : UserModel;

    let entity;

    if (role === Role.Vendor) {
      entity = await this._IVendorRepository.findById(id);
    } else {
      entity = await this._IUserRepository.findById(id);
    }

    if (!entity) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ success: false, message: MESSAGES.ACCOUNT_NOT_FOUND });
    }

    if (entity.isBlocked) {
      return res
        .status(STATUS_CODES.FORBIDDEN)
        .json({ success: false, message: MESSAGES.ACCOUNT_BLOCKED });
    }

    next();
  };
}
