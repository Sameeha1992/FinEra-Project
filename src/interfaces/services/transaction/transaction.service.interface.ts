import { PaginatedTransactionResponseDto } from "@/dto/transaction/transaction.dto";
import { VendorTransactionPdfItemDto } from "@/dto/transaction/vendor.transaction.pdf";

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
  ): Promise<PaginatedTransactionResponseDto>;

  getVendorTransactionReportData(
    vendorId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<VendorTransactionPdfItemDto[]>;
}
