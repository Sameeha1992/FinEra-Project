import { Types } from "mongoose";

export interface CreateLoanApplicationDTO {
  userId: string;
  vendorId: string;
  loanProductId: string;

  loanType: "PERSONAL" | "GOLD" | "HOME" | "BUSINESS";

  phoneNumber: string;
  employmentType: string;
  monthlyIncome: number;
  loanAmount: number;
  loanTenure: number;

  personalDetails?: {
    salarySlipUrl?:string;
    employerName?: string;
    yearsOfExperience?: number;
    purpose?: string;
  };

  goldDetails?: {
    goldWeight?: number;
    goldImageUrl?: string;
  };

  homeDetails?: {
    propertyValue?: number;
    propertyLocation?: string;
    propertyType?: string;
    propertyDocUrl?: string;
  };

  businessDetails?: {
    businessName?: string;
    businessType?: string;
    annualRevenue?: number;
    registrationDocUrl?: string;
  };
}