import { inject, injectable } from "tsyringe";
import { IUserDashboardService } from "../../interfaces/services/user/user.dashboard.service.interface";
import { IUserDashboardRepository } from "../../interfaces/repositories/user/user.dashboard.repository.interface";
import {
  UserDashboardDto,
  ActiveLoanCardDto,
  RejectedApplicationDto,
} from "../../dto/user/user.dashboard.dto";
import Emi from "../../models/emi/emi.model";
import { EmiStatus } from "../../models/enums/enum";

// Types for populated documents after .populate().lean()
interface PopulatedVendor {
  vendorName: string;
}

interface PopulatedLoanProduct {
  loanType: string;
  vendor: PopulatedVendor;
}

@injectable()
export class UserDashboardService implements IUserDashboardService {
  constructor(
    @inject("IUserDashboardRepository")
    private _dashboardRepo: IUserDashboardRepository,
  ) {}

  async getUserDashboard(userId: string): Promise<UserDashboardDto> {
    // 1. Fetch summary counts from repository
    const summary = await this._dashboardRepo.getDashboardSummary(userId);

    // 2. Fetch active loans (APPROVED) with populated product & vendor
    const activeLoans = await this._dashboardRepo.getActiveLoanCards(userId);

    // 3. Fetch rejected applications with populated vendor
    const rejectedApps = await this._dashboardRepo.getRejectedApplications(userId);

    // 4. Map active loans to ActiveLoanCardDto
    const activeLoanCards: ActiveLoanCardDto[] = await Promise.all(
      activeLoans.map(async (loan) => {
        // Get the populated loanProduct and its nested vendor
        const loanProduct = loan.loanProduct as unknown as PopulatedLoanProduct;

        const bankName = loanProduct?.vendor?.vendorName || "Unknown";
        const loanType = loanProduct?.loanType || "Unknown";

        // Calculate completion percentage
        const completionPercentage =
          loan.amount > 0
            ? Math.round(((loan.amount - loan.remainingAmount) / loan.amount) * 100)
            : 0;

        // Fetch the next unpaid EMI (earliest by dueDate, status not PAID)
        const nextEmi = await Emi.findOne({
          loan: loan._id,
          status: { $nin: [EmiStatus.PAID, EmiStatus.PAYMENT_IN_PROGRESS] },
        }).sort({ dueDate: 1 });

        return {
          loanId: loan._id.toString(),
          bankName,
          loanType,
          loanAmount: loan.amount,
          remainingDueAmount: loan.remainingAmount,
          nextEmiAmount: nextEmi ? nextEmi.amount : null,
          nextEmiDate: nextEmi ? nextEmi.dueDate : null,
          completionPercentage,
          expectedDueDate: loan.endDate || null,
        };
      }),
    );

    // 5. Map rejected applications to RejectedApplicationDto
    const rejectedApplications: RejectedApplicationDto[] = rejectedApps.map((app) => {
      const vendor = app.vendorId as unknown as PopulatedVendor;
      const bankName = vendor?.vendorName || "Unknown";

      return {
        applicationId: app._id.toString(),
        bankName,
        loanType: app.loanType,
        requestedAmount: app.loanAmount,
        rejectionReason: app.rejectionReason || "No reason provided",
        status: app.status,
      };
    });

    // 6. Return final dashboard DTO
    return {
      summary: {
        totalLoans: summary.totalLoans,
        activeLoans: summary.activeLoans,
        totalRemainingDues: summary.totalRemainingDues,
        rejectedApplications: summary.rejectedApplications,
      },
      activeLoanCards,
      rejectedApplications,
    };
  }
}
