import { STATUS_CODES } from "@/config/constants/statusCode";
import { CreateLoanApplicationDTO } from "@/dto/loanApplication/loanApplication.dto";
import { ILoanApplicationService } from "@/interfaces/services/loanApplication/loan.application.service.interface";
import { CustomError } from "@/middleware/errorMiddleware";
import { AuthenticateApplicationRequest, AuthenticateFileRequest } from "@/types/express/authenticateRequest.interface";
import { createLoanApplicationSchema } from "@/validations/loanApplication/loanApplication.validator";
import { Request,Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { ZodError } from "zod";

@injectable()
export class LoanApplicationController {
  constructor(
    @inject("ILoanApplicationService")
    private _iLoanApplicationService: ILoanApplicationService,
  ) {}

  async createLoanApplication(
    req: AuthenticateApplicationRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (req.body.businessDetails) {
      req.body.businessDetails = JSON.parse(req.body.businessDetails);
    }

    if (req.body.personalDetails) {
      req.body.personalDetails = JSON.parse(req.body.personalDetails);
    }

    if (req.body.goldDetails) {
      req.body.goldDetails = JSON.parse(req.body.goldDetails);
    }

    if (req.body.homeDetails) {
      req.body.homeDetails = JSON.parse(req.body.homeDetails);
    }

    const validatedData = createLoanApplicationSchema.parse(req.body);

    if (!req.user?.id) {
  throw new CustomError("Unauthorized", 401);
}
    const userId = req.user?.id
      const files = req.files as {
        goldImage?: Express.Multer.File[];
        propertyDoc?: Express.Multer.File[];
        registerationDoc?: Express.Multer.File[];
        salarySlipDoc?: Express.Multer.File[];
      };

      const result = await this._iLoanApplicationService.createLoanApplication({
   ...validatedData,
   userId: req.user?.id
}, files)
      res.status(STATUS_CODES.CREATED).json(result);
    } catch (error) {
          console.error("❌ FULL ERROR:", error);

      if (error instanceof ZodError) {
        return next(new CustomError(error.issues[0].message, 400));
      }
      next(error);
    }
  }
}
