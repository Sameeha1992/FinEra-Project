import { ILoanApplication } from "@/models/applications/application.model";
import { IBaseRepository } from "../../baseRepository.interface";
import {
  IUserApplicationsListResult,
  UserApplicationDetailsDTO,
} from "@/dto/user/userAppliaction/user.application.dto";

export interface IUserApplicationsRepository extends IBaseRepository<ILoanApplication> {
  getUserApplicationsList(
    userId: string,
    page: number,
    limit: number,
  ): Promise<IUserApplicationsListResult>;
  getUserApplicationDetails(
    applicationId: string,
    userId: string,
  ): Promise<ILoanApplication | null>;
}
