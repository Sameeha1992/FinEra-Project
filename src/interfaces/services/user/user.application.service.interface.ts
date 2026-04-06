import { IUserApplicationsListResponseDto, UserApplicationDetailsDTO } from "@/dto/user/userAppliaction/user.application.dto";

export interface IUserApplicationsService {
  getUserApplicationsList(
    userId: string,
    page: number,
    limit: number,
  ): Promise<IUserApplicationsListResponseDto>;
  getuserApplicationDetails(
    applicationId: string,
    userid: string,
  ): Promise<UserApplicationDetailsDTO>;
}
