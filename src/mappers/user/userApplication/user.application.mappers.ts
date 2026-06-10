import {
  UserApplicationDetailsDTO,
  UserApplicationListItemDTO,
} from "@/dto/user/userAppliaction/user.application.dto";
import { ILoanApplication } from "@/models/applications/application.model";
import { IVendor } from "@/models/vendor/vendor.model";
import { Types } from "mongoose";

export class userApplicationListMapper {
  static toListitem(app: ILoanApplication): UserApplicationListItemDTO {
    return {
      applicationId: (app._id as Types.ObjectId).toString(),
      applicationNumber: app.applicationNumber,
      loanType: app.loanType,
      loanAmount: app.loanAmount,
      status: app.status,
      appliedDate: app.createdAt.toISOString(),
      rejectionReason: app.rejectionReason,
      bankName: (app.vendorId as unknown as IVendor)?.vendorName || "Unknown",
    };
  }

  static toDetail(app: ILoanApplication): UserApplicationDetailsDTO {
    return {
      applicationId: (app._id as Types.ObjectId).toString(),
      applicationNumber: app.applicationNumber,
      loanType: app.loanType,
      loanAmount: app.loanAmount,
      loanTenure: app.loanTenure,
      monthlyIncome: app.monthlyIncome,
      employmentType: app.employmentType,
      phoneNumber: app.phoneNumber,
      status: app.status,
      appliedDate: app.createdAt,

      personalDetails: app.personalDetails,
      goldDetails: app.goldDetails,
      homeDetails: app.homeDetails,
      businessDetails: app.businessDetails,

      rejectionReason: app.rejectionReason,
      verifiedAt: app.verifiedAt,
      bankName: (app.vendorId as unknown as IVendor)?.vendorName || "Unknown",
    };
  }
}
