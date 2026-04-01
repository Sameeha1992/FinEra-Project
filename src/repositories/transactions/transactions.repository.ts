import { injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import Transaction, {
  ITransaction,
} from "@/models/transactions/transactions.model";
import { ITransactionRepository } from "@/interfaces/repositories/transactions/transactions.repository.interface";
import mongoose from "mongoose";

@injectable()
export class TransactionRepository
  extends BaseRepository<ITransaction>
  implements ITransactionRepository
{
  constructor() {
    super(Transaction);
  }

  async createTransaction(data: Partial<ITransaction>): Promise<ITransaction> {
    return await Transaction.create(data);
  }

  async findByTransactionId(
    transactionId: string,
  ): Promise<ITransaction | null> {
    return await this.model.findOne({ transactionId });
  }

  async getTransactionsByUserId(
    userId: string,
    skip: number,
    limit: number,
  ): Promise<{ transactions: ITransaction[]; total: number }> {
    const [transactions, total] = await Promise.all([
      this.model
        .find({ userId: new mongoose.Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this.model.countDocuments({
        userId: new mongoose.Types.ObjectId(userId),
      }),
    ]);

    return { transactions, total };
  }

  async getTransactionsByVendorId(
    vendorId: string,
    skip: number,
    limit: number,
  ): Promise<{ transactions: ITransaction[]; total: number }> {
    const [transactions, total] = await Promise.all([
      this.model
        .find({ vendorId: new mongoose.Types.ObjectId(vendorId) })
        .populate("userId", "name email phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      this.model.countDocuments({
        vendorId: new mongoose.Types.ObjectId(vendorId),
      }),
    ]);
    return { transactions, total };
  }

  async countTransactionsByUserId(userId: string): Promise<number> {
    return this.model.countDocuments({ userId });
  }

  async countTransactionsByVendorId(vendorId: string): Promise<number> {
    return this.model.countDocuments({ vendorId });
  }

  async getVendorTransactionsForReport(
    vendorId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<ITransaction[]> {
    const query: Record<string, unknown> = {
      vendorId: new mongoose.Types.ObjectId(vendorId),
    };

    if (startDate || endDate) {
      query.paidAt = {};

      if (startDate) {
        (query.paidAt as Record<string, Date>).$gte = startDate;
      }

      if (endDate) {
        (query.paidAt as Record<string, Date>).$lte = endDate;
      }
    }

    return await this.model
      .find(query)
      .populate("userId", "name")
      .populate("loanId", "loanType amount interestRate")
      .sort({ paidAt: -1 });
  }
}
