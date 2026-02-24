import { MESSAGES } from "@/config/constants/message";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { ILoanProductDto, UpdateLoanDto } from "@/dto/loanProduct/loanProduct.dto";
import { ILoanProductService } from "@/interfaces/services/loanProduct/loanProduct.service";
import { CustomError } from "@/middleware/errorMiddleware";
import { LoanType } from "@/models/enums/enum";
import { AuthenticateRequest } from "@/types/express/authenticateRequest.interface";
import { Request,Response,NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { success } from "zod";


@injectable()
export class LoanProductController{
    constructor(@inject("ILoanProductService") private _iloanProductService:ILoanProductService){}

    async createLoanProduct(req:AuthenticateRequest,res:Response,next:NextFunction):Promise<void>{
        try {
            const vendorId = (req.user?.id)

            if(!vendorId){
                throw new CustomError(MESSAGES.UNAUTHORIZED_ACCESS)
            }
            
            const data:ILoanProductDto = req.body;
            console.log("backend data",data)

            const response = await this._iloanProductService.createLoanProduct(data,vendorId.toString());

            res.status(STATUS_CODES.ACCEPTED).json({success:true,message:MESSAGES.SUCCESS,data:response})
        } catch (error) {
            next(error)
        }
    }

    async getVendorLoans(req:AuthenticateRequest ,res:Response,next:NextFunction):Promise<void>{
        try {

            const vendorId = req.user?.id;
            if(!vendorId){
                throw new CustomError(MESSAGES.UNAUTHORIZED_ACCESS,STATUS_CODES.UNAUTHORIZED)
            }

            console.log("Vendor ID:", vendorId); // ✅ Debug

            const search = (req.query.search as string) || "";
            const page = parseInt((req.query.page as string) || "1",10);
            const limit = parseInt((req.query.limit as string) || "10",10);

            const loans= await this._iloanProductService.getLoansByVendor(vendorId,search,page,limit);
            console.log("Loans returned from service:", loans); // ✅ Debug
            res.status(STATUS_CODES.SUCCESS).json({success:true,message:MESSAGES.SUCCESS,data:loans})
            
        } catch (error) {
            next(error)
        }
    }

    async updateLoanByVendor(req:AuthenticateRequest,res:Response,next:NextFunction){
        try {
            const {loanId} = req.params;

            const vendorId = req.user?.id;

            console.log("this is the loan edit update loan id",loanId)
            console.log("this is the vendorId",vendorId)
            if(!vendorId){
                throw new CustomError(MESSAGES.UNAUTHORIZED_ACCESS,STATUS_CODES.UNAUTHORIZED)
            }

            const updateData:UpdateLoanDto = req.body;
            console.log("data from the frontend",updateData)
             const updatedLoan = await this._iloanProductService.updateLoanByVendor(loanId,vendorId,updateData);
             console.log("this is the updated data in service",updatedLoan)

             return res.status(STATUS_CODES.ACCEPTED).json({success:true,message:MESSAGES.LOAN_UPDATED_SUCCESSFULLY,data:updatedLoan})
        } catch (error) {
            next(error)
        }
    }
    

    async getLoanById(req:AuthenticateRequest,res:Response,next:NextFunction){
        try {
            const {loanId} = req.params;
            const vendorId = req.user?.id;

            if(!vendorId){
                return res.status(STATUS_CODES.UNAUTHORIZED).json({message:MESSAGES.UNAUTHORIZED_ACCESS})
            }

            const loan = await this._iloanProductService.getLoanIdByVendor(loanId,vendorId);

            return res.status(STATUS_CODES.SUCCESS).json({success:true,data:loan})
        } catch (error) {
            next(error)
        }
    }

    async getLoanDetails(req:AuthenticateRequest,res:Response,next:NextFunction){
        try {
            const vendorId = req.user?.id;
            const {loanId} = req.params;

            if(!vendorId){
                throw new CustomError(MESSAGES.UNAUTHORIZED_ACCESS,STATUS_CODES.UNAUTHORIZED)
            }

            if(!loanId){
                throw new CustomError(MESSAGES.LOAN_ID_REQUIRED,STATUS_CODES.BAD_REQUEST)
            }

            const loanDetails = await this._iloanProductService.getLoanDetails(loanId,vendorId)

            console.log("loan details",loanDetails)
            return res.status(STATUS_CODES.SUCCESS).json({success:true,message:MESSAGES.LOAN_DETAILS_FETCHED,data:loanDetails})
        } catch (error) {
            next(error)
        }
    }
async getActiveLoansForUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { loanType, userSalary, page = "1", limit = "10", search } = req.query;

    console.log("Controller: req.query =>", req.query);

    // Loan type required
    if (!loanType) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.LOANTYPE_REQUIRED,
      });
      return;
    }

    // Salary OPTIONAL
    const parsedSalary = userSalary !== undefined ? Number(userSalary) : 0;

    console.log("Controller: loanType =>", loanType);
    console.log("Controller: parsedSalary =>", parsedSalary);
    console.log("Controller: page =>", page, "limit =>", limit);
    console.log("Controller: search =>", search);

    const result = await this._iloanProductService.getActiveLoansForUser(
      loanType as LoanType,
      parsedSalary,
      Number(page),
      Number(limit),
      search as string | undefined
    );

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: MESSAGES.ACTIVE_LOANS_FETCHED_SUCCESSFULLY,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
}