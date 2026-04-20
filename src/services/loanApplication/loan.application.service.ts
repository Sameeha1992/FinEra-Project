import { MESSAGES } from "@/config/constants/message";
import { CreateLoanApplicationDTO } from "@/dto/loanApplication/loanApplication.dto";
import { IStorageService } from "@/interfaces/helper/storageService.interface";
import { ILoanApplicationRepository } from "@/interfaces/repositories/loanApplication/loan.application.interface";
import { IUserRepository } from "@/interfaces/repositories/user/userRepository.interface";
import { ILoanApplicationService } from "@/interfaces/services/loanApplication/loan.application.service.interface";
import { IVendorNotificationService } from "@/interfaces/services/notifications/vendor.notification.service.interface.";
import { CustomError } from "@/middleware/errorMiddleware";
import { ILoanApplication } from "@/models/applications/application.model";
import {
  LoanApplicationStatus,
  LoanType,
  VendorNotificationType,
} from "@/models/enums/enum";
import { Types } from "mongoose";
import { inject, injectable } from "tsyringe";
import { v4 as uuid } from "uuid";
@injectable()
export class LoanApplicationService implements ILoanApplicationService {
  constructor(
    @inject("ILoanApplicationRepository")
    private _iLoanApplicationRepo: ILoanApplicationRepository,
    @inject("IStorageService") private _IStorageService: IStorageService,
    @inject("IUserRepository")
    private readonly _iuserRepository: IUserRepository,
    @inject("IVendorNotificationService")
    private readonly _iVendorNotificationService: IVendorNotificationService,
  ) {}

  async createLoanApplication(
    dto: CreateLoanApplicationDTO,
    files?: {
      goldImage?: Express.Multer.File[];
      propertyDoc?: Express.Multer.File[];
      registerationDoc?: Express.Multer.File[];
      salarySlipDoc?: Express.Multer.File[];
    },
  ): Promise<{ success: boolean; message: string }> {
    await this.validateUserProfileCompletion(dto.userId);

    const hasActiveLoan = await this._iLoanApplicationRepo.existingActiveLoans(
      dto.userId,
      dto.vendorId,
      dto.loanType,
    );
    if (hasActiveLoan) {
      throw new CustomError(MESSAGES.ACTIVE_LOANS_EXISTS);
    }

    if (typeof dto.personalDetails === "string") {
      dto.personalDetails = JSON.parse(dto.personalDetails);
    }

    if (typeof dto.goldDetails === "string") {
      dto.goldDetails = JSON.parse(dto.goldDetails);
    }

    if (typeof dto.homeDetails === "string") {
      dto.homeDetails = JSON.parse(dto.homeDetails);
    }

    if (typeof dto.businessDetails === "string") {
      dto.businessDetails = JSON.parse(dto.businessDetails);
    }

    //Upload Gold image:-

    if (files?.goldImage?.[0]) {
      const key = `loan-applications/gold/${uuid()}`;
      await this._IStorageService.uploadImage(files.goldImage[0], key);

      dto.goldDetails = {
        ...dto.goldDetails,
        goldImageUrl: key,
      };
    }

    //Upload Home Document:-

    if (files?.propertyDoc?.[0]) {
      const key = `loan-applications/home/${uuid()}`;
      await this._IStorageService.uploadImage(files.propertyDoc[0], key);

      dto.homeDetails = {
        ...dto.homeDetails,
        propertyDocUrl: key,
      };
    }

    //Business Registration:-

    if (files?.registerationDoc?.[0]) {
      const key = `loan-applications/business/${uuid()}`;
      await this._IStorageService.uploadImage(files.registerationDoc[0], key);
      dto.businessDetails = {
        ...dto.businessDetails,
        registrationDocUrl: key,
      };
    }

    //Personal Registration:-

    if (files?.salarySlipDoc?.[0]) {
      const key = `loan-applications/personal/${uuid()}`;
      await this._IStorageService.uploadImage(files.salarySlipDoc[0], key);
      dto.personalDetails = {
        ...dto.personalDetails,
        salarySlipUrl: key,
      };
    }

    switch (dto.loanType) {
      case LoanType.PERSONAL:
        if (!dto.personalDetails)
          throw new CustomError(MESSAGES.PERSONAL_LOAN_DETAILS_REQUIRED);
        break;
      case LoanType.GOLD:
        if (!dto.goldDetails)
          throw new CustomError(MESSAGES.GOLD_LOAN_DETAILS_REQUIRED);
        break;
      case LoanType.BUSINESS:
        if (!dto.businessDetails)
          throw new CustomError(MESSAGES.BUSINESS_LOAN_DETAILS_REQUIRED);
        break;
      case LoanType.HOME:
        if (!dto.homeDetails)
          throw new CustomError(MESSAGES.HOME_LOAN_DETAILS_REQUIRED);
    }

    const applicationNumber = `APP-${uuid().slice(0, 8).toUpperCase()}`;
    const loanData: Partial<ILoanApplication> = {
      ...dto,
      applicationNumber: applicationNumber,
      userId: new Types.ObjectId(dto.userId),
      vendorId: new Types.ObjectId(dto.vendorId),
      loanProductId: new Types.ObjectId(dto.loanProductId),
    };


    const savedApplication = await this._iLoanApplicationRepo.create(loanData);

    const user = await this._iuserRepository.findById(dto.userId);

    if (user) {
      await this._iVendorNotificationService.createNotification({
        vendorId: savedApplication.vendorId.toString(),
        userId: savedApplication.userId.toString(),
        applicationId: savedApplication._id.toString(),
        title: "New Loan Application",
        message: `${user.name} has applied for a ${savedApplication.loanType} loan.`,
        type: VendorNotificationType.NEW_LOAN_APPLICATION,
      });
    }
    return {
      success: true,
      message: MESSAGES.LOAN_APPLICATION_SUBMITTED_SUCCESSFULLY,
    };
  }

  async reapplyRejectedLoan(
    applicationId: string,
    dto: CreateLoanApplicationDTO,
    files?: {
      goldImage?: Express.Multer.File[];
      propertyDoc?: Express.Multer.File[];
      registerationDoc?: Express.Multer.File[];
      salarySlipDoc?: Express.Multer.File[];
    },
  ): Promise<{ success: boolean; message: string }> {
    const existingLoan =
      await this._iLoanApplicationRepo.findById(applicationId);
    if (!existingLoan)
      throw new CustomError(MESSAGES.LOAN_APPLICATION_NOT_FOUND);

    if (existingLoan.status !== "REJECTED") {
      throw new CustomError(MESSAGES.REJECTED_LOANS_SHOULD_REAPPLIED);
    }

    await this.validateUserProfileCompletion(existingLoan.userId.toString());

    if (typeof dto.personalDetails === "string") {
      dto.personalDetails = JSON.parse(dto.personalDetails);
    }

    if (typeof dto.goldDetails === "string") {
      dto.goldDetails = JSON.parse(dto.goldDetails);
    }

    if (typeof dto.homeDetails === "string") {
      dto.homeDetails = JSON.parse(dto.homeDetails);
    }

    if (typeof dto.businessDetails === "string") {
      dto.businessDetails = JSON.parse(dto.businessDetails);
    }

    if (files?.goldImage?.[0]) {
      const key = `loan-applications/gold/${uuid()}`;
      await this._IStorageService.uploadImage(files.goldImage[0], key);
      dto.goldDetails = { ...dto.goldDetails, goldImageUrl: key };
    }

    if (files?.propertyDoc?.[0]) {
      const key = `loan-applications/home/${uuid()}`;
      await this._IStorageService.uploadImage(files.propertyDoc[0], key);
      dto.homeDetails = { ...dto.homeDetails, propertyDocUrl: key };
    }

    if (files?.registerationDoc?.[0]) {
      const key = `loan-applications/business/${uuid()}`;
      await this._IStorageService.uploadImage(files.registerationDoc[0], key);
      dto.businessDetails = { ...dto.businessDetails, registrationDocUrl: key };
    }

    if (files?.salarySlipDoc?.[0]) {
      const key = `loan-applications/personal/${uuid()}`;
      await this._IStorageService.uploadImage(files.salarySlipDoc[0], key);
      dto.personalDetails = { ...dto.personalDetails, salarySlipUrl: key };
    }

    const updated = await this._iLoanApplicationRepo.updateById(applicationId, {
      ...dto,
      userId: existingLoan.userId,
      vendorId: existingLoan.vendorId,
      loanProductId: existingLoan.loanProductId,
      status: LoanApplicationStatus.PENDING,
      rejectionReason: undefined,
      updatedAt: new Date(),
    });
    if (!updated) {
      throw new CustomError(MESSAGES.LOAN_REAPPLY_ERROR);
    }

    return {
      success: true,
      message: MESSAGES.LOAN_REAPPLY_SUCCESS,
    };
  }

  async validateUserProfileCompletion(userId: string): Promise<void> {
    const user = await this._iuserRepository.findById(userId);

    if (!user) {
      throw new CustomError(MESSAGES.USER_NOT_FOUND);
    }

    if (!user.isProfileComplete) {
      throw new CustomError(MESSAGES.PROFILE_NOT_COMPLETED);
    }
  }
}
