import { ILoanProductDto, ILoanProductEntityDto, ILoanProductResponseDto, LoanListingDto } from "@/dto/loanProduct/loanProduct.dto";

export interface ILoanProductService{
    createLoanProduct(data:ILoanProductDto,vendorId:string):Promise<ILoanProductResponseDto>
    getLoansByVendor(vendorId:string,search:string,page:number,limit:number):Promise<LoanListingDto>
}