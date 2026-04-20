import { injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import Transaction, {
  ITransaction,
} from "@/models/transactions/transactions.model";
import { ITransactionRepository } from "@/interfaces/repositories/transactions/transactions.repository.interface";
import mongoose, { FilterQuery } from "mongoose";
import { PaymentStatus } from "@/models/enums/enum";
import { VendorDashboardExportDto, VendorReportFilterDto } from "@/dto/vendorDto/vendorDashboard.dto";

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
    search?: string,
  ): Promise<{ transactions: ITransaction[]; total: number }> {
    const filter: FilterQuery<ITransaction> = {
      vendorId: new mongoose.Types.ObjectId(vendorId),
    };

    if (search && search.trim() !== "") {
      filter.transactionId = { $regex: search.trim(), $options: "i" };
    }
    const [transactions, total] = await Promise.all([
      this.model
        .find(filter)
        .populate("userId", "name email phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      this.model.countDocuments(filter),
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
  filters: VendorReportFilterDto,
): Promise<VendorDashboardExportDto[]> {
  const matchStage: Record<string, unknown> = {
    vendorId: new mongoose.Types.ObjectId(vendorId),
    paymentStatus: PaymentStatus.COMPLETED,
  };

  if (filters.userId && mongoose.Types.ObjectId.isValid(filters.userId)) {
    matchStage.userId = new mongoose.Types.ObjectId(filters.userId);
  }

  if (filters.transactionId) {
    matchStage.transactionId = filters.transactionId;
  }

  if (filters.date) {
    const start = new Date(filters.date);
    const end = new Date(filters.date);
    end.setHours(23, 59, 59, 999);

    matchStage.paidAt = {
      $gte: start,
      $lte: end,
    };
  } else if (filters.month && filters.year) {
    const start = new Date(filters.year, filters.month - 1, 1);
    const end = new Date(filters.year, filters.month, 0, 23, 59, 59, 999);

    matchStage.paidAt = {
      $gte: start,
      $lte: end,
    };
  } else if (filters.year) {
    const start = new Date(filters.year, 0, 1);
    const end = new Date(filters.year, 11, 31, 23, 59, 59, 999);

    matchStage.paidAt = {
      $gte: start,
      $lte: end,
    };
  } else if (filters.startDate || filters.endDate) {
    const paidAtFilter: Record<string, Date> = {};

    if (filters.startDate) {
      paidAtFilter.$gte = new Date(filters.startDate);
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      paidAtFilter.$lte = end;
    }

    matchStage.paidAt = paidAtFilter;
  }

  const pipeline: mongoose.PipelineStage[] = [
    { $match: matchStage },

    {
      $lookup: {
        from: "user",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $lookup: {
        from: "loans",
        localField: "loanId",
        foreignField: "_id",
        as: "loan",
      },
    },
    {
      $unwind: {
        path: "$loan",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $lookup: {
        from: "loanproducts",
        localField: "loan.loanProduct",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: {
        path: "$product",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $lookup: {
        from: "emis",
        localField: "emiId",
        foreignField: "_id",
        as: "emi",
      },
    },
    {
      $unwind: {
        path: "$emi",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  if (filters.loanType) {
    pipeline.push({
      $match: {
        "product.loanType": filters.loanType,
      },
    });
  }

  pipeline.push(
    {
      $project: {
        _id: 0,
        transactionId: "$transactionId",
        userName: "$user.name",
        userEmail: "$user.email",
        loanType: "$product.loanType",
        productName: "$product.name",
        loanAmount: "$loan.amount",
        interestRate: "$loan.interestRate",
        emiNumber: "$emi.emiNumber",
        emiAmount: "$emi.amount",
        penaltyPaid: { $ifNull: ["$penaltyAmount", 0] },
        totalPaid: "$totalAmount",
        paymentStatus: "$paymentStatus",
        paidAt: "$paidAt",
      },
    },
    {
      $sort: { paidAt: -1 },
    },
  );

  return await this.model.aggregate(pipeline);
}
}
