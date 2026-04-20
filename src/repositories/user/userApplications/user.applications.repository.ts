import {
  IUserApplicationsListResult,
} from "@/dto/user/userAppliaction/user.application.dto";
import { IUserApplicationsRepository } from "@/interfaces/repositories/user/userLoanApplication/user.applications.service.interface";
import loanApplication, {
  ILoanApplication,
} from "@/models/applications/application.model";
import { BaseRepository } from "@/repositories/base_repository";
import { FilterQuery } from "mongoose";
import { injectable } from "tsyringe";

@injectable()
export class UserApplicationsRepository
  extends BaseRepository<ILoanApplication>
  implements IUserApplicationsRepository
{
  constructor() {
    super(loanApplication);
  }

  async getUserApplicationsList(
    userId: string,
    page: number,
    limit: number,
    search?:string,
  ): Promise<IUserApplicationsListResult> {
    const skip = (page - 1) * limit;
    const filter: FilterQuery<ILoanApplication>= { userId };


  if (search && search.trim() !== "") {
    filter.$or = [
      { applicationNumber: { $regex: search, $options: "i" } },
      { loanType: { $regex: search, $options: "i" } },
      { phoneNumber: { $regex: search, $options: "i" } },
    ];
  }


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
    userId: string,
  ): Promise<ILoanApplication | null> {
    const application = await loanApplication
      .findOne({ _id: applicationId, userId })
      .populate("loanProductId")
      .populate("vendorId", "vendorName");

    return application;
  }
}
