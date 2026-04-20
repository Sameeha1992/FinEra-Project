import { ILoan } from "../../../models/loan/loan.model";
import { ILoanApplication } from "../../../models/applications/application.model";

export interface IUserDashboardRepository {
  /**
   * Get basic counts for the user dashboard summary
   */
  getDashboardSummary(userId: string): Promise<{
    totalLoans: number;
    activeLoans: number;
    totalRemainingDues: number;
    rejectedApplications: number;
  }>;

  /**
   * Get all active (APPROVED) loans for the user with populated product and vendor details
   */
  getActiveLoanCards(userId: string): Promise<ILoan[]>;

  /**
   * Get all rejected applications for the user with populated vendor details
   */
  getRejectedApplications(userId: string): Promise<ILoanApplication[]>;
}
