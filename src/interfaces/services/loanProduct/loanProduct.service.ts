import { ILoanProductDto, ILoanProductEntityDto, ILoanProductResponseDto, LoanListingDto, UpdateLoanDto } from "@/dto/loanProduct/loanProduct.dto";
import { LoanType } from "@/models/enums/enum";
import { ILoanProduct } from "@/models/loan/loanProduct.model";
import { PopulatedLoanProduct } from "@/types/populate.loan.type";


export interface ILoanProductService{
    createLoanProduct(data:ILoanProductDto,vendorId:string):Promise<ILoanProductResponseDto>
    getLoansByVendor(vendorId:string,search:string,page:number,limit:number):Promise<LoanListingDto>
    updateLoanByVendor(loanId:string,vendorId:string,updateData:UpdateLoanDto):Promise<ILoanProductResponseDto>
    getLoanIdByVendor(loanId:string,vendorId:string):Promise<ILoanProductResponseDto>
    getLoanDetails(loanId:string,vendorId:string):Promise<ILoanProductDto>

    getActiveLoansForUser(loanType:LoanType,userSalary:number,page:number,limit:number,search?:string):Promise<{loans:PopulatedLoanProduct[];total:number;page:number,limit:number}>
}