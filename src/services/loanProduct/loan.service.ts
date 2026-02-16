import { MESSAGES } from "@/config/constants/message";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { ILoanProductDto, ILoanProductEntityDto, ILoanProductResponseDto, LoanListingDto } from "@/dto/loanProduct/loanProduct.dto";
import { ILoanProductRepository } from "@/interfaces/repositories/loanProduct/loanProduct.repository";
import { ILoanProductService } from "@/interfaces/services/loanProduct/loanProduct.service";
import { LoanProductMapper } from "@/mappers/loanProduct/loanProduct.mapper";
import { CustomError } from "@/middleware/errorMiddleware";
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

}