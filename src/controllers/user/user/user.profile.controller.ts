import { IUserprofileService } from "../../../interfaces/services/user/user.profile.interface";
import { Request, Response, NextFunction } from "express";
import {
  AuthenticateFileRequest,
  AuthenticateRequest,
} from "@/types/express/authenticateRequest.interface";
import { inject, injectable } from "tsyringe";
import { STATUS_CODES } from "../../../config/constants/statusCode";
import { CustomError } from "@/middleware/errorMiddleware";
import { MESSAGES } from "@/config/constants/message";
import { success } from "zod";
import { UserUpdateCompleteProfile } from "@/dto/user/profile.dto";

@injectable()
export class UserProfileController {
  constructor(
    @inject("IUserProfileService")
    private _userProfileService: IUserprofileService,
  ) {}

  async getProfile(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.user?.id) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ message: MESSAGES.UNAUTHORIZED_ACCESS });
      }

      const profile = await this._userProfileService.getProfile(req.user.id);

      return res
        .status(STATUS_CODES.SUCCESS)
        .json({ success: true, data: profile });
    } catch (error) {
      throw new CustomError(MESSAGES.SOMETHING_WENT_WRONG);
    }
  }

  completeProfile = async (req: Request, res: Response, next: NextFunction) => {
    const typedReq = req as AuthenticateFileRequest;

    const userId = typedReq.user!.id;

    const result = await this._userProfileService.completeProfile(
      userId,
      typedReq.body,
      {
        adhaarDoc: typedReq.files?.adhaarDoc?.[0],
        panDoc: typedReq.files?.panDoc?.[0],
        cibilDoc: typedReq.files?.cibilDoc?.[0],
      },
    );

    return res
      .status(STATUS_CODES.SUCCESS)
      .json({ success: true, message: MESSAGES.PROFILE_UPDATED, data: result });
  };

  async getCompleteProfile(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new CustomError(MESSAGES.USER_NOT_FOUND);
      }

      const profileData =
        await this._userProfileService.getCompleteProfile(userId);

      res
        .status(STATUS_CODES.SUCCESS)
        .json({
          success: true,
          message: MESSAGES.FETCHED_USER_PROFILE_DATA_SUCCESSFULLY,
          data: profileData,
        });
    } catch (error) {
      next(error);
    }
  }

  async updateProfileImage(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.file) {
        throw new CustomError(MESSAGES.FILE_MISSING);
      }

      const userId = req.user!.id;
      const extension = req.file.mimetype.split("/")[1];

      const key = `profiles/${userId}.${extension}`;

      const updateProfile = await this._userProfileService.updateProfileImage(
        userId,
        req.file,
        key,
      );

      return res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.IMAGE_UPLOAD_SUCCESS,
        data: updateProfile,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCompleteProfile(req:Request,res:Response,next:NextFunction){
    try {
      const typedReq = req as AuthenticateFileRequest
      const userId = typedReq.user?.id;

      if(!userId){
        throw new CustomError(MESSAGES.UNAUTHORIZED_ACCESS)
      }

      const dto: UserUpdateCompleteProfile = req.body;
      console.log("dto of the update",dto)

      const files = {
        adhaarDoc:typedReq.files?.adhaarDoc?.[0],
         panDoc: typedReq.files?.panDoc?.[0]
      };

      const updatedProfile = await this._userProfileService.updateCompleteProfile(userId,dto,files)
      console.log("this is the backend controller",updatedProfile)
      res.status(STATUS_CODES.SUCCESS).json({success:true,message:MESSAGES.PROFILE_UPDATED,data:updatedProfile})
    } catch (error) {
      next(error)
    }
  }
}
