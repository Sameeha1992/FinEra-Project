import { MESSAGES } from "@/config/constants/message";
import {
  IUserApplicationsListResponseDto,
  IUserApplicationsListResult,
  UserApplicationDetailsDTO,
  UserApplicationListItemDTO,
} from "@/dto/user/userAppliaction/user.application.dto";
import { IStorageService } from "@/interfaces/helper/storageService.interface";
import { ILoanRepository } from "@/interfaces/repositories/loan/loan.repository.interface";
import { IUserApplicationsRepository } from "@/interfaces/repositories/user/userLoanApplication/user.applications.service.interface";
import { IUserApplicationsService } from "@/interfaces/services/user/user.application.service.interface";
import { userApplicationListMapper } from "@/mappers/user/userApplication/user.application.mappers";
import { CustomError } from "@/middleware/errorMiddleware";
import { inject, injectable } from "tsyringe";

@injectable()
export class UserApplicationService implements IUserApplicationsService {
  constructor(
    @inject("IUserApplicationsRepository") private _IuserApplicationRepo: IUserApplicationsRepository,
      @inject("ILoanRepository") private _iLoanRepository:ILoanRepository,
      @inject("IStorageService") private _iStorageService:IStorageService

  ) {}
  async getUserApplicationsList(
    userId: string,
    page: number,
    limit: number,
  ): Promise<IUserApplicationsListResponseDto> {
    if (!userId) {
      throw new CustomError(MESSAGES.USER_NOT_FOUND);
    }

    const result = await this._IuserApplicationRepo.getUserApplicationsList(
      userId,
      page,
      limit,
    );
    return {
      applications: result.applications.map((app) =>
        userApplicationListMapper.toListitem(app),
      ),
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    };
  }

  async getuserApplicationDetails(
    applicationId: string,
    userId: string,
  ): Promise<UserApplicationDetailsDTO> {
    if (!applicationId || !userId) {
      throw new CustomError(MESSAGES.INVALID_REQUEST);
    }

    const application =
      await this._IuserApplicationRepo.getUserApplicationDetails(
        applicationId,
        userId,
      );

    if (!application) {
      throw new CustomError(MESSAGES.LOAN_APPLICATION_NOT_FOUND);
    }
    if(application.homeDetails?.propertyDocUrl){
      application.homeDetails.propertyDocUrl = await this._iStorageService.generateSignedUrl(application.homeDetails.propertyDocUrl,3600)
    }

     if(application.personalDetails?.salarySlipUrl){
      application.personalDetails.salarySlipUrl = await this._iStorageService.generateSignedUrl(application.personalDetails.salarySlipUrl,3600)
    }

     if(application.goldDetails?.goldImageUrl){
      application.goldDetails.goldImageUrl = await this._iStorageService.generateSignedUrl(application.goldDetails.goldImageUrl,3600)
    }

     if(application.businessDetails?.registrationDocUrl){
      application.businessDetails.registrationDocUrl = await this._iStorageService.generateSignedUrl(application.businessDetails.registrationDocUrl,3600)
    }

    const result = userApplicationListMapper.toDetail(application);
    const loan = await this._iLoanRepository.findByApplicationId(applicationId);

    return{
      ...result,
      loanMongoId:loan? loan._id.toString():undefined
    }
  }
}
