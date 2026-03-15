import {
  VendorApplicationDetailsDTO,
  VendorApplicationListItemDTO,
  VendorApplicationQueryDTO,
} from "@/dto/vendorDto/user.verification.list.dto";

export interface IUserVerificationService {
  getUserApplicationList(query: VendorApplicationQueryDTO): Promise<{
    data: VendorApplicationListItemDTO[];
    total: number;
    page: number;
    totalPages: number;
  }>;

  getApplicationDetail(
    applicationId: string,
    vendorId: string,
  ): Promise<VendorApplicationDetailsDTO>;

  approveLoan(applicationId:string,vendorId:string):Promise<{success:boolean,message:string}>
  rejectedLoan(applicationId:string,vendorId:string,rejectionReason:string):Promise<{success:boolean,message:string}>
}
