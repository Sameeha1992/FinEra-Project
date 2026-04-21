import { ILoanApplication } from "@/models/applications/application.model";


//User application list:-

export interface UserApplicationListItemDTO {
  applicationId: string;
  applicationNumber: string;
  loanType: string;
  loanAmount: number;
  status: string;
  appliedDate: string;
  rejectionReason?: string;
}

export interface IUserApplicationsListResult {
  applications: ILoanApplication[];
  total: number;
  page: number;
  totalPages: number;

}


export interface IUserApplicationsListResponseDto {
  applications: UserApplicationListItemDTO[];
  total: number;
  page: number;
  totalPages: number;

}



//User application detail dtos:-


export interface UserApplicationDetailsDTO {
  applicationId: string;
  applicationNumber: string;
  loanType: string;
  loanAmount: number;
  loanTenure: number;
  monthlyIncome: number;
  employmentType: string;
  phoneNumber: string;
  status: string;
  appliedDate: Date;

    loanMongoId?: string;


  personalDetails?: {
    employerName?: string;
    yearsOfExperience?: number;
    purpose?: string;
    salarySlipUrl?: string;
  };

  goldDetails?: {
    goldWeight?: number;
    goldImageUrl?: string;
  };

  homeDetails?: {
    propertyValue?: number;
    propertyLocation?: string;
    propertyDocUrl?: string;
  };

  businessDetails?: {
    businessName?: string;
    annualRevenue?: number;
    registrationDocUrl?: string;
  };

  rejectionReason?: string;
  verifiedAt?: Date;
  
}