import { MESSAGES } from "@/config/constants/message";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { ILoanProductDto } from "@/dto/loanProduct/loanProduct.dto";
import { ILoanProductService } from "@/interfaces/services/loanProduct/loanProduct.service";
import { CustomError } from "@/middleware/errorMiddleware";
import { AuthenticateRequest } from "@/types/express/authenticateRequest.interface";
import { Request,Response,NextFunction } from "express";
import { inject, injectable } from "tsyringe";


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
}