 import { injectable } from "tsyringe";
import mongoose from "mongoose";
import { IUserDashboardRepository } from "../../interfaces/repositories/user/user.dashboard.repository.interface";
import Loan, { ILoan } from "../../models/loan/loan.model";
import LoanApplication, { ILoanApplication } from "../../models/applications/application.model";

@injectable()
export class UserDashboardRepository implements IUserDashboardRepository {
  /**
   * Get basic counts for the user dashboard summary
   */
  async getDashboardSummary(userId: string): Promise<{
    totalLoans: number;
    activeLoans: number;
    totalRemainingDues: number;
    rejectedApplications: number;
  }> {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1. Total Loans (Count of all loans assigned to the user)
    const totalLoans = await Loan.countDocuments({ user: userObjectId });

    // 2. Active Loans (Only APPROVED loans as per requirement)
    const activeLoans = await Loan.countDocuments({
      user: userObjectId,
      status: "APPROVED",
    });

    // 3. Total Remaining Dues (Sum of remainingAmount from APPROVED loans)
    const totalRemainingDuesResult = await Loan.aggregate([
      {
        $match: {
          user: userObjectId,
          status: "APPROVED",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$remainingAmount" },
        },
      },
    ]);

    const totalRemainingDues = totalRemainingDuesResult[0]?.total || 0;

    // 4. Rejected Applications (Count from LoanApplication collection)
    const rejectedApplications = await LoanApplication.countDocuments({
      userId: userObjectId,
      status: "REJECTED",
    });

    return {
      totalLoans,
      activeLoans,
      totalRemainingDues,
      rejectedApplications,
    };
  }

  /**
   * Get all active (APPROVED) loans for the user with populated product and vendor details
   */
  async getActiveLoanCards(userId: string): Promise<ILoan[]> {
    return await Loan.find({
      user: new mongoose.Types.ObjectId(userId),
      status: "APPROVED",
    })
      .populate({
        path: "loanProduct",
        populate: {
          path: "vendor",
          model: "Vendor",
        },
      })
      .lean();
  }

  /**
   * Get all rejected applications for the user with populated vendor details
   */
  async getRejectedApplications(userId: string): Promise<ILoanApplication[]> {
    return await LoanApplication.find({
      userId: new mongoose.Types.ObjectId(userId),
      status: "REJECTED",
    })
      .populate({
        path: "vendorId",
        model: "Vendor",
      })
      .lean();
  }
}
