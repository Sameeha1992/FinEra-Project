import { EmiListingLoans } from "@/dto/emi/create.emi.dto";

export interface IEmiService{
    getEmisByLoanId(loanId:string,userId:string):Promise<EmiListingLoans[]>
}