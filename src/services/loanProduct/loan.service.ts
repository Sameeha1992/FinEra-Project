import { MESSAGES } from "@/config/constants/message";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { LoanListingResult } from "@/dto/loanProduct/loanListingUser";
import { ILoanProductDto, ILoanProductEntityDto, ILoanProductResponseDto, LoanListingDto, UpdateLoanDto } from "@/dto/loanProduct/loanProduct.dto";
import { ILoanProductRepository } from "@/interfaces/repositories/loanProduct/loanProduct.repository";
import { ILoanProductService } from "@/interfaces/services/loanProduct/loanProduct.service";
import { LoanProductMapper } from "@/mappers/loanProduct/loanProduct.mapper";
import { CustomError } from "@/middleware/errorMiddleware";
import { LoanType } from "@/models/enums/enum";
import { PopulatedLoanProduct } from "@/types/populate.loan.type";
import { inject, injectable } from "tsyringe";

@injectable()
export class LoanProductService implements ILoanProductService{
    constructor(@inject("ILoanProductRepository") private _loanRepository:ILoanProductRepository){}
    async createLoanProduct(data: ILoanProductDto, vendorId: string): Promise<ILoanProductResponseDto> {
        
        if(data.amount.minimum > data.amount.maximum){
            throw new CustomError(MESSAGES.MINIMUM_AMOUNT_SHOULD_NOT_EXCEED_MAXIMUM_AMOUNT)
        }

        if(data.tenure.minimum >data.tenure.maximum){
            throw new CustomError(MESSAGES.MINIMUM_TENURE_SHOULD_NOT_EXCEED_MAXIMUM)
        }

        if(!data.loanType){
            throw new CustomError(MESSAGES.LOAN_TYPE_REQUIRED,STATUS_CODES.BAD_REQUEST)
        }

        const existingLoan = await this._loanRepository.findByNameAndVendor(data.name,vendorId)

        if(existingLoan){
            throw new CustomError(MESSAGES.LOAN_ALREADY_EXISTS,STATUS_CODES.CONFLICT)
        }
        const loanId = `LN-${Date.now()}`;

        const entityData = LoanProductMapper.toEntity(
            data,
            vendorId,loanId
        );

        const savedLoan = await this._loanRepository.create(entityData);

        return LoanProductMapper.toResponse(savedLoan)
    }

    async getLoansByVendor(vendorId: string,search:string="",page:number=1,limit:number=10): Promise<LoanListingDto> {
        

        if(!vendorId){
            throw new CustomError(MESSAGES.UNAUTHORIZED_ACCESS,STATUS_CODES.UNAUTHORIZED)
        }


      const result = await this._loanRepository.getLoanByVendor(
        vendorId,
        search,
        page,
        limit
      )

        return result
    }


    async updateLoanByVendor(loanId:string,vendorId:string,updateData:UpdateLoanDto):Promise<ILoanProductResponseDto>{
        if(!vendorId){
            throw new CustomError(MESSAGES.UNAUTHORIZED_ACCESS,STATUS_CODES.UNAUTHORIZED)
        }
        
        

        if(!loanId){
           throw new CustomError(MESSAGES.LOAN_ID_REQUIRED,STATUS_CODES.BAD_REQUEST)
        }

        const updatedLoan = await this._loanRepository.updateLoanByVendor(loanId,vendorId,updateData);

        console.log(updateData,"updated sdavgsujhwfjhv")
        if(!updatedLoan){
            throw new CustomError(MESSAGES.NO_LOANS_FOUND,STATUS_CODES.NOT_FOUND)
        }

        return LoanProductMapper.toResponse(updatedLoan)
    }

    async getLoanIdByVendor(loanId: string, vendorId: string): Promise<ILoanProductResponseDto> {
        if(!vendorId){
            throw new CustomError(MESSAGES.UNAUTHORIZED_ACCESS,STATUS_CODES.UNAUTHORIZED)
        }

        if(!loanId){
            throw new CustomError(MESSAGES.LOAN_ID_REQUIRED,STATUS_CODES.BAD_REQUEST)
        }

        const loan = await this._loanRepository.findByLoanIdAndVendor(loanId,vendorId);

        if(!loan){
            throw new CustomError(MESSAGES.NO_LOANS_FOUND,STATUS_CODES.NOT_FOUND)
        }

        return LoanProductMapper.toResponse(loan)
    }

    async getLoanDetails(loanId:string,vendorId:string):Promise<ILoanProductDto>{

        if(!vendorId){
            throw new CustomError(MESSAGES.UNAUTHORIZED_ACCESS,STATUS_CODES.UNAUTHORIZED)
        }

        if(!loanId){
            throw new CustomError(MESSAGES.LOAN_ID_REQUIRED,STATUS_CODES.BAD_REQUEST)
        }

        const loan = await this._loanRepository.findByLoanIdAndVendor(loanId,vendorId);

        if(!loan){
            throw new CustomError(MESSAGES.NO_LOANS_FOUND,STATUS_CODES.NOT_FOUND)
        }

        return LoanProductMapper.toResponse(loan)
    }

    async getActiveLoansForUser(
    loanType: LoanType,
    userSalary?:number,
    page: number = 1,
    limit: number = 10,
    search?:string
  ): Promise<{
    loans: PopulatedLoanProduct[];
    total: number;
    page: number;
    limit: number;
  }> {

    const result: LoanListingResult =
      await this._loanRepository.getActiveLoansForUsers(
        loanType,
        userSalary ?? 0,
        page,
        limit,
        search
      );
      console.log("Service: loanType", loanType);
console.log("Service: userSalary", userSalary);
console.log("Service: page", page, "limit", limit, "search", search);

    return {
      loans: result.loans as unknown as PopulatedLoanProduct[],
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }
}