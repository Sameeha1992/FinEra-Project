import { AdminDashboardDto } from "@/dto/admin/admin.dashboard.dto";
import { ILoanApplicationRepository } from "@/interfaces/repositories/loanApplication/loan.application.interface";
import { IUserRepository } from "@/interfaces/repositories/user/userRepository.interface";
import { IVendorRepository } from "@/interfaces/repositories/vendor/vendor.auth";
import { IAdminDashboardService } from "@/interfaces/services/admin/admin.dashboard.service.interface";
import { inject, injectable } from "tsyringe";

const PROCESSING_FEE = 500;
@injectable()
export class AdminDashboardService implements IAdminDashboardService {
  constructor(
    @inject("IUserRepository")
    private readonly _iUserRpository: IUserRepository,
    @inject("IVendorRepository")
    private readonly _iVendorRepository: IVendorRepository,
    @inject("ILoanApplicationRepository")
    private readonly _iLoanApplicationRepository: ILoanApplicationRepository,
  ) {}

  async getDashboardData(): Promise<AdminDashboardDto> {
    const [
      totalUsers,
      totalVendors,
      verifiedVendors,
      nonVerifiedVendors,
      rejectedVendors,
      totalLoanApplications,
      approvedLoans,
    ] = await Promise.all([
      this._iUserRpository.countUser(),
      this._iVendorRepository.countVendors(),
      this._iVendorRepository.countVerifiedVendors(),
      this._iVendorRepository.countNonVerifiedVendors(),
      this._iVendorRepository.countRejectedVendors(),
      this._iLoanApplicationRepository.countLoanApplications(),
      this._iLoanApplicationRepository.countApprovedLoans(),
    ]);

    const totalRevenue = approvedLoans * PROCESSING_FEE;

    return {
      summary: {
        totalUsers,
        totalVendors,
        verifiedVendors,
        nonVerifiedVendors,
        rejectedVendors,
        totalLoanApplications,
        approvedLoans,
        totalRevenue,
      },
      vendorStatusOverview: {
        approved: verifiedVendors,
        pending: nonVerifiedVendors,
        rejected: rejectedVendors,
      },
    };
  }
}
