import { ILoanProduct } from "@/models/loan/loanProduct.model";
import { IBaseRepository } from "../baseRepository.interface";
import { ILoanProductEntityDto, LoanListingDto, UpdateLoanDto } from "@/dto/loanProduct/loanProduct.dto";
import { LoanType } from "@/models/enums/enum";
import { LoanListingResult } from "@/dto/loanProduct/loanListingUser";

export interface ILoanProductRepository extends IBaseRepository<ILoanProduct>{
findByNameAndVendor(name: string, vendorId: string): Promise<any | null>;
getLoanByVendor(vendorId:string,search:string,page:number,limit:number):Promise<LoanListingDto>
updateLoanByVendor(loanId:string,vendorId:string,updateData:UpdateLoanDto):Promise<ILoanProduct |null>
findByLoanIdAndVendor(loanId:string,vendorId:string):Promise<ILoanProduct |null>

getActiveLoansForUsers(loanType:LoanType,userSalary:number,page: number, limit: number,search?:string): Promise<LoanListingResult>
}