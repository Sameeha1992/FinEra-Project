import { ITransaction } from "@/models/transactions/transactions.model";
import { IBaseRepository } from "../baseRepository.interface";
import { VendorDashboardExportDto, VendorReportFilterDto } from "@/dto/vendorDto/vendorDashboard.dto";

export interface ITransactionRepository extends IBaseRepository<ITransaction> {
  createTransaction(data: Partial<ITransaction>): Promise<ITransaction>;

  findByTransactionId(transactionId: string): Promise<ITransaction | null>;

  getTransactionsByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{
    transactions: ITransaction[];
    total: number;
  }>;

  getTransactionsByVendorId(
    vendorId: string,
    page: number,
    limit: number,
    search?:string,
  ): Promise<{
    transactions: ITransaction[];
    total: number;
  }>;

  countTransactionsByUserId(userId: string): Promise<number>;

  countTransactionsByVendorId(vendorId: string): Promise<number>;

  getVendorTransactionsForReport(
   vendorId: string,
   filters: VendorReportFilterDto,
 ): Promise<VendorDashboardExportDto[]>
}
