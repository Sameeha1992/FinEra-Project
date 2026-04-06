import { VendorApplicationDetailsDTO } from "@/dto/vendorDto/user.verification.list.dto";
import { ILoanApplication } from "@/models/applications/application.model";
import { ILoanProduct } from "@/models/loan/loanProduct.model";
import { IUser } from "@/models/user/user.model";

export class userApplicationMapper {
  static toDetail(
    app: ILoanApplication & { userId: IUser; loanProductId: ILoanProduct },
  ): VendorApplicationDetailsDTO {
    const user = app.userId;
    const loanProduct = app.loanProductId;

    return {
      applicationId: app.id.toString(),
      applicationNumber: app.applicationNumber,
      loanType: app.loanType,
      loanAmount: app.loanAmount,
      loanTenure: app.loanTenure,
      monthlyIncome: app.monthlyIncome,
      employmentType: app.employmentType,
      phoneNumber: app.phoneNumber,
      status: app.status,
      appliedDate: app.createdAt,

      user: {
        customerId: user.customerId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        dob: user.dob,
        job: user.job,
        income: user.income,
        gender: user.gender,
        adhaarNumber: user.adhaarNumber,
        panNumber: user.panNumber,
        cibilScore: user.cibilScore,
        adhaarDoc: user.adhaarDoc,
        panDoc: user.panDoc,
        cibilDoc: user.cibilDoc,
        additionalDoc: user.additionalDoc,
      },

      personalDetails: app.personalDetails,
      goldDetails: app.goldDetails,
      homeDetails: app.homeDetails,
      businessDetails: app.businessDetails,

      rejectionReason: app.rejectionReason,
      verifiedAt: app.verifiedAt,
    };
  }
}
