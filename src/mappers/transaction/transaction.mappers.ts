import { 
  UserTransactionResponseDto, 
  VendorTransactionResponseDto 
} from "@/dto/transaction/transaction.dto";
import { ITransaction } from "@/models/transactions/transactions.model";

export class TransactionMapper {

  // 👤 USER SIDE
  static toUserTransactionDto(
    transaction: ITransaction,
  ): UserTransactionResponseDto {
    return {
      id: transaction._id.toString(),
      transactionId: transaction.transactionId ?? "",
      amount: transaction.amount,
      paymentStatus: transaction.paymentStatus,
      penaltyAmount: transaction.penaltyAmount ?? 0,
      totalAmount: transaction.totalAmount,
      paidAt: transaction.paidAt,
    };
  }

  // 🏢 VENDOR SIDE
  static toVendorTransactionDto(
    transaction: ITransaction,
  ): VendorTransactionResponseDto {

    const user = transaction.userId as any // because of populate

    return {
      id: transaction._id.toString(),
      transactionId: transaction.transactionId ?? "",
      userName: user.name ?? "Unknown User",
      userEmail: user?.email ?? "",
      amount: transaction.amount,
      paymentStatus: transaction.paymentStatus,
      penaltyAmount: transaction.penaltyAmount ?? 0,
      totalAmount: transaction.totalAmount,
      paidAt: transaction.paidAt,
    };
  }
}