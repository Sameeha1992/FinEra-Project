import { MESSAGES } from "@/config/constants/message";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { IEmiService } from "@/interfaces/services/emi/emi.servive.interface";
import { CustomError } from "@/middleware/errorMiddleware";
import { AuthenticateRequest } from "@/types/express/authenticateRequest.interface";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { success } from "zod";

@injectable()
export class EmiController {
  constructor(@inject("IEmiService") private _iEmiService: IEmiService) {}

  async getEmisByLoanId(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { loanId } = req.params;
      const userId = req.user?.id;
      console.log("controller loanId:", loanId);
      if (!userId) {
        throw new Error("User id not found");
      }
      const emis = await this._iEmiService.getEmisByLoanId(loanId, userId);
      console.log("controller emis:", emis);

      res
        .status(STATUS_CODES.SUCCESS)
        .json({
          success: true,
          message: MESSAGES.EMI_LIST_FETCHED_SUCCESSFULLY,
          data: emis,
        });
    } catch (error) {
      console.log("controller error:", error);

      if (error instanceof Error) {
        console.log("error message:", error.message);
        console.log("error stack:", error.stack);
      }
      next(error);
    }
  }

  async getEmiDetails(req:AuthenticateRequest,res:Response,next:NextFunction){
   try{
     const userId = req.user?.id;
    const {emiId} = req.params;
     if (!userId || !emiId) {
      throw new CustomError(
        MESSAGES.INVALID_REQUEST,
        STATUS_CODES.BAD_REQUEST
      );
    }

    const data = await this._iEmiService.getEmiDetails(emiId,userId);
    return res.status(STATUS_CODES.SUCCESS).json({success:true,message:MESSAGES.EMI_DETAIL_FETCHED_SUCCESSFULLY,data:data})
}catch(error){
  console.log("Something issue in the detail of emi that is paid",error);
  next(error)
}  }
}
