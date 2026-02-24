import { ILoanProduct } from "@/models/loan/loanProduct.model";

export interface LoanListingResult {
  loans: ILoanProduct[];
  total: number;
  page: number;
  limit: number;
}