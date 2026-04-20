import { IUserApplicationsListResponseDto, UserApplicationDetailsDTO } from "@/dto/user/userAppliaction/user.application.dto";

export interface IUserApplicationsService {
  getUserApplicationsList(
    userId: string,
    page: number,
    limit: number,
    search?:string,
  ): Promise<IUserApplicationsListResponseDto>;
  getuserApplicationDetails(
    applicationId: string,
    userid: string,
  ): Promise<UserApplicationDetailsDTO>;
}
