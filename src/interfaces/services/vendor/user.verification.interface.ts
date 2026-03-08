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

  getApplicationDetail(applicationId:string,vendorId:string):Promise<VendorApplicationDetailsDTO>
}
