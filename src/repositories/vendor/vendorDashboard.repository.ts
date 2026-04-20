import mongoose from "mongoose";
import LoanApplication from "@/models/applications/application.model";
import LoanProduct from "@/models/loan/loanProduct.model";
import Loan from "@/models/loan/loan.model";
import Emi from "@/models/emi/emi.model";
import Transaction from "@/models/transactions/transactions.model";
import { LoanApplicationStatus, EmiStatus, PaymentStatus } from "@/models/enums/enum";
import { IVendorDashboardRepository } from "@/interfaces/repositories/vendor/vendorDashboard.repository.interface";
import { injectable } from "tsyringe";
import { MonthlyApplicationTrendDto, VendorDashboardExportDto, VendorReportFilterDto } from "@/dto/vendorDto/vendorDashboard.dto";

@injectable()
export class VendorDashboardRepository implements IVendorDashboardRepository {
    async getLoanApplicationCounts(vendorId: string) {
        const counts = await LoanApplication.aggregate([
            { $match: { vendorId: new mongoose.Types.ObjectId(vendorId) } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    pending: {
                        $sum: { $cond: [{ $eq: ["$status", LoanApplicationStatus.PENDING] }, 1, 0] }
                    },
                    approved: {
                        $sum: { $cond: [{ $eq: ["$status", LoanApplicationStatus.APPROVED] }, 1, 0] }
                    },
                    rejected: {
                        $sum: { $cond: [{ $eq: ["$status", LoanApplicationStatus.REJECTED] }, 1, 0] }
                    }
                }
            }
        ]);

        return counts[0] ? {
            total: counts[0].total,
            pending: counts[0].pending,
            approved: counts[0].approved,
            rejected: counts[0].rejected
        } : { total: 0, pending: 0, approved: 0, rejected: 0 };
    }

    async getLoanProductCount(vendorId: string): Promise<number> {
        return await LoanProduct.countDocuments({ vendor: new mongoose.Types.ObjectId(vendorId) });
    }

    async getActiveLoanCount(vendorId: string): Promise<number> {
        const result = await Loan.aggregate([
            {
                $lookup: {
                    from: "loanproducts",
                    localField: "loanProduct",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            { $match: { "product.vendor": new mongoose.Types.ObjectId(vendorId), status: "APPROVED" } }, // Assuming APPROVED means active
            { $count: "total" }
        ]);
        return result[0]?.total || 0;
    }

    async getOverdueLoansCount(vendorId: string): Promise<number> {
        const today = new Date();
        const result = await Loan.aggregate([
            {
                $lookup: {
                    from: "loanproducts",
                    localField: "loanProduct",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            { $match: { "product.vendor": new mongoose.Types.ObjectId(vendorId), status: "APPROVED" } },
            {
                $lookup: {
                    from: "emis",
                    localField: "_id",
                    foreignField: "loan",
                    as: "emis"
                }
            },
            {
                $match: {
                    "emis": {
                        $elemMatch: {
                            $or: [
                                { status: EmiStatus.OVERDUE },
                                { dueDate: { $lt: today }, status: { $ne: EmiStatus.PAID } }
                            ]
                        }
                    }
                }
            },
            { $count: "count" }
        ]);
        return result[0]?.count || 0;
    }

    async getRepaymentsSumThisMonth(vendorId: string): Promise<number> {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const result = await Transaction.aggregate([
            {
                $match: {
                    vendorId: new mongoose.Types.ObjectId(vendorId),
                    paymentStatus: PaymentStatus.COMPLETED,
                    createdAt: { $gte: startOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);
        return result[0]?.total || 0;
    }

    async getOutstandingPenaltySum(vendorId: string): Promise<number> {
        const result = await Emi.aggregate([
            {
                $lookup: {
                    from: "loans",
                    localField: "loan",
                    foreignField: "_id",
                    as: "loanData"
                }
            },
            { $unwind: "$loanData" },
            {
                $lookup: {
                    from: "loanproducts",
                    localField: "loanData.loanProduct",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $match: {
                    "product.vendor": new mongoose.Types.ObjectId(vendorId),
                    status: { $ne: EmiStatus.PAID }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$penalty" }
                }
            }
        ]);
        return result[0]?.total || 0;
    }

    async getMonthlyApplicationTrend(vendorId: string): Promise<MonthlyApplicationTrendDto[]> {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        return await LoanApplication.aggregate([
            {
                $match: {
                    vendorId: new mongoose.Types.ObjectId(vendorId),
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    approved: { $sum: { $cond: [{ $eq: ["$status", LoanApplicationStatus.APPROVED] }, 1, 0] } },
                    rejected: { $sum: { $cond: [{ $eq: ["$status", LoanApplicationStatus.REJECTED] }, 1, 0] } },
                    pending: { $sum: { $cond: [{ $eq: ["$status", LoanApplicationStatus.PENDING] }, 1, 0] } }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);
    }

    async getLoanTypeDistribution(vendorId: string): Promise<{ label: string; value: number }[]> {
        return await LoanApplication.aggregate([
            { $match: { vendorId: new mongoose.Types.ObjectId(vendorId) } },
            {
                $group: {
                    _id: "$loanType",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    label: "$_id",
                    value: "$count"
                }
            },
            { $sort: { value: -1 } }
        ]);
    }
async getExportData(
  vendorId: string,
  filters: VendorReportFilterDto
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

  if (filters.month && filters.year) {
    const start = new Date(filters.year, filters.month - 1, 1);
    const end = new Date(filters.year, filters.month, 0, 23, 59, 59, 999);

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
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },

    {
      $lookup: {
        from: "loans",
        localField: "loanId",
        foreignField: "_id",
        as: "loan",
      },
    },
    { $unwind: "$loan" },

    {
      $lookup: {
        from: "loanproducts",
        localField: "loan.loanProduct",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },

    {
      $lookup: {
        from: "emis",
        localField: "emiId",
        foreignField: "_id",
        as: "emi",
      },
    },
    { $unwind: "$emi" },
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
        userName: "$user.name",
        userEmail: "$user.email",
        loanType: "$product.loanType",
        productName: "$product.name",
        interestRate: "$loan.interestRate",
        emiNumber: "$emi.emiNumber",
        emiAmount: "$emi.amount",
        penaltyPaid: "$penaltyAmount",
        totalPaid: "$totalAmount",
        paidAt: "$paidAt",
        transactionId: "$transactionId",
      },
    },
    { $sort: { paidAt: -1 } }
  );

  return await Transaction.aggregate(pipeline);
}
}
