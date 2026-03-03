import { LoanStatus } from "@/models/enums/enum";
import { ILoanProduct } from "@/models/loan/loanProduct.model";

export interface LoanListingResult {
  loans: ILoanProduct[];
  total: number;
  page: number;
  limit: number;
}

export interface LoanDetailForUserDto {
  loanId: string;
  vendor:{
    id:string;
    vendorName:string;
  }
  name: string;
  description: string;
  status: LoanStatus;
  amount: {
    minimum: number;
    maximum: number;
  };
  tenure: {
    minimum: number;
    maximum: number;
  };
  interestRate: number;
  duePenalty: number;
  eligibility: {
    minAge?: number;
    maxAge?: number;
    minSalary?: number;
    minCibilScore?:number;
  };
}
