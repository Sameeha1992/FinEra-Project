import { MESSAGES } from "@/config/constants/message";
import {
  PaginatedUserTransactionResponseDto,
  PaginatedVendorTransactionResponseDto,
} from "@/dto/transaction/transaction.dto";
import { ITransactionService } from "@/interfaces/services/transaction/transaction.service.interface";
import { CustomError } from "@/middleware/errorMiddleware";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { inject, injectable } from "tsyringe";
import { ITransactionRepository } from "@/interfaces/repositories/transactions/transactions.repository.interface";
import { TransactionMapper } from "@/mappers/transaction/transaction.mappers";
import {
  VendorTransactionPdfItemDto,
} from "@/dto/transaction/vendor.transaction.pdf";
import { VendorReportFilterDto } from "@/dto/vendorDto/vendorDashboard.dto";

@injectable()
export class TransactionService implements ITransactionService {
  constructor(
    @inject("ITransactionRepository")
    private readonly _iTransactionRepository: ITransactionRepository,
  ) {}
  async getUserTransactions(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedUserTransactionResponseDto> {
    if (!userId) {
      throw new CustomError(MESSAGES.USER_NOT_FOUND, STATUS_CODES.BAD_REQUEST);
    }

    const currentPage = Math.max(1, Number(page) || 1);
    const perPage = Math.max(1, Number(limit) || 10);
    const skip = (currentPage - 1) * perPage;

    const { transactions, total } =
      await this._iTransactionRepository.getTransactionsByUserId(
        userId,
        skip,
        perPage,
      );

    return {
      transactions: transactions.map((transaction) =>
        TransactionMapper.toUserTransactionDto(transaction),
      ),
      total,
      currentPage,
      totalPages: Math.ceil(total / perPage),
    };
  }

  async getVendorTransactions(
    vendorId: string,
    page: number,
    limit: number,
    search?:string,
  ): Promise<PaginatedVendorTransactionResponseDto> {
    if (!vendorId) {
      throw new CustomError(
        MESSAGES.VENDOR_NOT_FOUND,
        STATUS_CODES.BAD_REQUEST,
      );
    }

    const currentPage = Math.max(1, Number(page) || 1);
    const perPage = Math.max(1, Number(limit) || 10);
    const skip = (currentPage - 1) * perPage;

    const { transactions, total } =
      await this._iTransactionRepository.getTransactionsByVendorId(
        vendorId,
        skip,
        perPage,
        search,
      );

    return {
      transactions: transactions.map((transaction) =>
        TransactionMapper.toVendorTransactionDto(transaction),
      ),
      total,
      currentPage,
      totalPages: Math.ceil(total / perPage),
    };
  }

 async getVendorTransactionReportData(
  vendorId: string,
  filters: VendorReportFilterDto,
): Promise<VendorTransactionPdfItemDto[]> {
  if (!vendorId) {
    throw new CustomError(
      MESSAGES.VENDOR_NOT_FOUND,
      STATUS_CODES.BAD_REQUEST,
    );
  }

  if (filters.month && !filters.year) {
    throw new CustomError(
      "Year is required when month is provided",
      STATUS_CODES.BAD_REQUEST,
    );
  }

  const transactions =
    await this._iTransactionRepository.getVendorTransactionsForReport(
      vendorId,
      filters,
    );

  return transactions.map((transaction) => ({
    transactionId: transaction.transactionId,
    userName: transaction.userName ?? "Unknown User",
    loanType: transaction.loanType as VendorTransactionPdfItemDto["loanType"],
    loanAmount: transaction.loanAmount ?? 0,
    interestRate: transaction.interestRate ?? 0,
    penaltyAmount: transaction.penaltyPaid ?? 0,
    totalPaidAmount: transaction.totalPaid ?? 0,
    paymentStatus:
      transaction.paymentStatus as VendorTransactionPdfItemDto["paymentStatus"],
    paidAt: transaction.paidAt,
  }));
}
}
