import { LoanStatus, LoanType } from "@/models/enums/enum";
import  {Types, ObjectId } from "mongoose";

export interface EligibilityDto {
  minAge?: number;
  maxAge?: number;
  minSalary?: number;
  minCibilScore?: number;
}

export interface ILoanProductDto {
  name: string;
  description: string;
  status: LoanStatus;
  loanType:LoanType;
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
  processingFee:number;

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
  processingFee:number

  status:LoanStatus
  loanType:LoanType

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
  processingFee:number;

  status: LoanStatus;
  loanType:LoanType;

  features: string[];
  eligibility: EligibilityDto;
}


export interface LoanItemDto{
  loanId:string,
  name:string,
  amount:string,
  tenure:string,
  interestRate:string,
  loanType:LoanType,
  status:LoanStatus
}

export interface LoanListingDto{
 loans:LoanItemDto[];
 total:number;
 page:number;
 limit:number
} 


export interface UpdateLoanDto {
  loanId:string,
  name?: string;
  description?: string;
  interestRate?: number;
  duePenalty?: number;
  amount?: {
    minimum: number;
    maximum: number;
  };
  tenure?: {
    minimum: number;
    maximum: number;
  };
  eligibility?: EligibilityDto;
  status?: LoanStatus;
  loanType:LoanType;
  features?: string[];
}
