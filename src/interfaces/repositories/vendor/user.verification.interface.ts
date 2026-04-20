import {
  VendorApplicationDetailsDTO,
  VendorApplicationListItemDTO,
  VendorApplicationQueryDTO,
} from "@/dto/vendorDto/user.verification.list.dto";
import { IBaseRepository } from "../baseRepository.interface";
import { ILoanApplication } from "@/models/applications/application.model";

export interface IUserVerificationRepo extends IBaseRepository<ILoanApplication> {
  getUserApplicationList(query: VendorApplicationQueryDTO): Promise<{
    data: VendorApplicationListItemDTO[];
    total: number;
    page: number;
    totalPages: number;
    search?:string;
  }>;
  getApplicationDetails(
    applicationId: string,
    vendorId: string,
  ): Promise<VendorApplicationDetailsDTO | null>;

  rejectLoan(
    applicationId: string,
    vendorId: string,
    rejectionReason: string,
  ): Promise<ILoanApplication | null>;

  approveLoan(
    applicationId: string,
    vendorId: string,
  ): Promise<ILoanApplication | null>;
}
