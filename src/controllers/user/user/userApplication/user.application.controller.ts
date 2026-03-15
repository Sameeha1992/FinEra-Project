import { MESSAGES } from "@/config/constants/message";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { IUserApplicationsService } from "@/interfaces/services/user/user.application.service.interface";
import { AuthenticateRequest } from "@/types/express/authenticateRequest.interface";
import { NextFunction, Response } from "express";
import { inject, injectable } from "tsyringe";


@injectable()
export class UserApplicationController {
  constructor(
    @inject("IUserApplicationsService")
    private _IuserApplicationService: IUserApplicationsService,
  ) {}

  async getuserApplicationList(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user?.id;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await this._IuserApplicationService.getUserApplicationsList(userId!,page,limit);
      res.status(STATUS_CODES.SUCCESS).json({success:true,message:MESSAGES.USER_FETCHED_SUCCESSFULLY,data:result})
    } catch (error) {
        next(error)
    }
  }

   async getUserApplicationDetails(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      const { applicationId } = req.params;

      const result =
        await this._IuserApplicationService.getuserApplicationDetails(
          applicationId,
          userId!
        );

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.APPLICATION_DETAILS_FETCHED_SUCCESSFULLY,
        data: result,
      });
    } catch (error) {
      next(error);
    }
}
}
