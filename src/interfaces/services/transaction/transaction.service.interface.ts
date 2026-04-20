import { PaginatedTransactionResponseDto } from "@/dto/transaction/transaction.dto";
import { VendorTransactionPdfItemDto } from "@/dto/transaction/vendor.transaction.pdf";
import { VendorReportFilterDto } from "@/dto/vendorDto/vendorDashboard.dto";

export interface ITransactionService {
  getUserTransactions(
    userId: string,
    page: number,
    limit: number,
    
  ): Promise<PaginatedTransactionResponseDto>;
  getVendorTransactions(
    vendorId: string,
    page: number,
    limit: number,
    search?:string
  ): Promise<PaginatedTransactionResponseDto>;

  getVendorTransactionReportData(
      vendorId: string,
     filters:VendorReportFilterDto
    ): Promise<VendorTransactionPdfItemDto[]> 
}
