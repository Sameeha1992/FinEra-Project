import { ILoanProduct } from "@/models/loan/loanProduct.model";

export type PopulatedLoanProduct = Omit<ILoanProduct, "vendor"> & {
  vendor: {
    _id: string;
    bankName: string;
  };
};