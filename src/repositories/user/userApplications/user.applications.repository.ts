import { IUserApplicationsListResult, UserApplicationDetailsDTO } from "@/dto/user/userAppliaction/user.application.dto";
import { IUserApplicationsRepository } from "@/interfaces/repositories/user/userLoanApplication/user.applications.service.interface";
import { userApplicationListMapper } from "@/mappers/user/userApplication/user.application.mappers";
import { userApplicationMapper } from "@/mappers/vendor/application.mapper";
import loanApplication, { ILoanApplication } from "@/models/applications/application.model";
import { BaseRepository } from "@/repositories/base_repository";
import { injectable } from "tsyringe";


@injectable()
export class UserApplicationsRepository extends BaseRepository<ILoanApplication> implements IUserApplicationsRepository{
    constructor(){
        super(loanApplication)
    }

   async getUserApplicationsList(
    userId: string,
    page: number,
    limit: number
  ): Promise<IUserApplicationsListResult> {
    const skip = (page - 1) * limit;
    const filter = { userId };

    const total = await loanApplication.countDocuments(filter);

    const applications = await loanApplication
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      applications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
    
  async getUserApplicationDetails(
    applicationId: string,
    userId: string
  ): Promise<ILoanApplication | null> {
    const application = await loanApplication
      .findOne({ _id: applicationId, userId })
      .populate("loanProductId")
      .populate("vendorId","vendorName");

    return application;
  }
    
}