import { UserDashboardDto } from "../../../dto/user/user.dashboard.dto";

export interface IUserDashboardService {
  /**
   * Orchestrates the fetching and mapping of user dashboard data
   * @param userId The authenticated user's ID
   */
  getUserDashboard(userId: string): Promise<UserDashboardDto>;
}
