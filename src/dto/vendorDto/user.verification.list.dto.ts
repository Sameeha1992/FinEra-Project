export interface VendorApplicationQueryDTO {
  vendorId: string;
  page: number;
  limit: number;
  search?: string;
}

export interface VendorApplicationListItemDTO{
    applicationId:string,
    applicationNumber:string,
    name:string,
    loanType:string,
    loanAmount:number,
    status:string,
    appliedDate:string,
}


export interface VendorApplicationDetailsDTO {
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

  user: {
    customerId: string;
    name: string;
    email: string;
    phone?: string;
    profileImage?: string;
    dob?: string;
    job?: string;
    income?: string;
    gender?: string;

    adhaarNumber?: string;
    panNumber?: string;
    cibilScore?: string;

    adhaarDoc?: string;
    panDoc?: string;
    cibilDoc?: string;
    additionalDoc?: string;
  };


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