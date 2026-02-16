import  {Types, ObjectId } from "mongoose";

export interface EligibilityDto {
  minAge?: number;
  maxAge?: number;
  minSalary?: number;
  minCibilScore?: number;
  otherCriteria?: string[];
}

export interface ILoanProductDto {
  name: string;
  description: string;
  status: string;
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

  features?: string[];
  eligibility?: EligibilityDto;
}

export interface ILoanProductEntityDto {
  vendor: Types.ObjectId;
  loanId: string;

  name: string;
  description: string;

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

  status: "ACTIVE" | "INACTIVE";

  features: string[];
  eligibility: EligibilityDto;
}

export interface ILoanProductResponseDto {
  loanId: string;

  name: string;
  description: string;

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

  status: string;

  features: string[];
  eligibility: EligibilityDto;
}


export interface LoanItemDto{
  loanId:string,
  name:string,
  amount:string,
  tenure:string,
  interestRate:string,
  status:"ACTIVE"|"INACTIVE"
}

export interface LoanListingDto{
 loans:LoanItemDto[];
 total:number;
 page:number;
 limit:number
} 

export interface UpdateLoanDto{
  loanName?: string;
  interestRate?: number;
  processingFee?: number;
  minimumAmount?: number;
  maximumAmount?: number;
  tenure?: number;
  description?: string;
  eligibility?: string;
  status?: "ACTIVE" | "INACTIVE";
}