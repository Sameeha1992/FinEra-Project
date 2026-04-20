import { IUserVerificationRepo } from "@/interfaces/repositories/vendor/user.verification.interface";
import { BaseRepository } from "../base_repository";
import LoanApplication, {
  ILoanApplication,
} from "@/models/applications/application.model";
import {
  VendorApplicationQueryDTO,
  VendorApplicationListItemDTO,
  VendorApplicationDetailsDTO,
} from "@/dto/vendorDto/user.verification.list.dto";
import { Types } from "mongoose";
import { injectable } from "tsyringe";
import { userApplicationMapper } from "@/mappers/vendor/application.mapper";
import { ILoanProduct } from "@/models/loan/loanProduct.model";
import { IUser } from "@/models/user/user.model";

@injectable()
export class UserVerificationRepo
  extends BaseRepository<ILoanApplication>
  implements IUserVerificationRepo
{
  constructor() {
    super(LoanApplication);
  }
  async getUserApplicationList(
    query: VendorApplicationQueryDTO,
  ): Promise<{
    data: VendorApplicationListItemDTO[];
    total: number;
    page: number;
    totalPages: number;
    
  }> {
    const { vendorId, page, limit, search } = query;
    const skip = (page - 1) * limit;

    const filter: {
      vendorId: string;
      loanType?: { $regex: string; $options: string };
    } = { vendorId };

    if (search) {
      filter.loanType = { $regex: search, $options: "i" };
    }
    const total = await LoanApplication.countDocuments(filter);
    const applications = await LoanApplication.find(filter)
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const data: VendorApplicationListItemDTO[] = applications.map((app) => ({
      applicationId: (app._id as Types.ObjectId).toString(),
      name: (app.userId as { name?: string })?.name ?? "",
      applicationNumber: app.applicationNumber,
      loanType: app.loanType,
      loanAmount: app.loanAmount,
      status: app.status,
      appliedDate: app.createdAt.toISOString(),
    }));

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getApplicationDetails(
    applicationId: string,
    vendorId: string,
  ): Promise<VendorApplicationDetailsDTO | null> {
    const application = await LoanApplication.findOne({
      _id: applicationId,
      vendorId,
    }).populate(
      "userId",
      "customerId name email phone dob job income gender adhaarNumber panNumber cibilScore adhaarDoc panDoc",
    );

    if (!application) return null;

    return userApplicationMapper.toDetail(
      application as unknown as ILoanApplication & {
        userId: IUser;
        loanProductId: ILoanProduct;
      },
    );
  }

  async rejectLoan(
    applicationId: string,
    vendorId: string,
    rejectionReason: string,
  ): Promise<ILoanApplication | null> {
    return await LoanApplication.findOneAndUpdate(
      {
        _id: applicationId,
        vendorId: vendorId,
      },
      {
        status: "REJECTED",
        rejectionReason,
        verifiedAt: undefined,
      },
      { new: true },
    );
  }
  async approveLoan(
    applicationId: string,
    vendorId: string,
  ): Promise<ILoanApplication | null> {
    return await LoanApplication.findOneAndUpdate(
      {
        _id: applicationId,
        vendorId: vendorId,
      },
      {
        status: "APPROVED",
        verifiedAt: new Date(),
        rejectionReason: undefined,
      },
      { new: true },
    );
  }
}
