import { UserApplicationDetailsDTO, UserApplicationListResponseDTO } from "@/dto/user/userAppliaction/user.application.dto";

export interface IUserApplicationsService{
    getUserApplicationsList(userId:string,page:number,limit:number):Promise<UserApplicationListResponseDTO>
    getuserApplicationDetails(applicationId:string,userid:string):Promise<UserApplicationDetailsDTO>
}