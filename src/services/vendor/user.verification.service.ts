import { MESSAGES } from "@/config/constants/message";
import { CreateEmiDTO } from "@/dto/emi/create.emi.dto";
import {
  VendorApplicationQueryDTO,
  VendorApplicationListItemDTO,
  VendorApplicationDetailsDTO,
} from "@/dto/vendorDto/user.verification.list.dto";
import { IStorageService } from "@/interfaces/helper/storageService.interface";
import { IEmiRepository } from "@/interfaces/repositories/emi/emi.repository.interface";
import { ILoanRepository } from "@/interfaces/repositories/loan/loan.repository.interface";
import { ILoanProductRepository } from "@/interfaces/repositories/loanProduct/loanProduct.repository";
import { IUserVerificationRepo } from "@/interfaces/repositories/vendor/user.verification.interface";
import { IEmiService } from "@/interfaces/services/emi/emi.servive.interface";
import { INotificationService } from "@/interfaces/services/notifications/notification.service.interface";
import { IUserVerificationService } from "@/interfaces/services/vendor/user.verification.interface";
import { CreateLoanMappers } from "@/mappers/loan/loan.mapper";
import { CustomError } from "@/middleware/errorMiddleware";
import { NotificationType } from "@/models/enums/enum";
import mongoose from "mongoose";
import { inject, injectable } from "tsyringe";

@injectable()
export class UserVerificationService implements IUserVerificationService {
  constructor(
    @inject("IUserVerificationRepo")
    private _iUserVerificationRepo: IUserVerificationRepo,
    @inject("IStorageService") private _IStorageService: IStorageService,
    @inject("ILoanProductRepository")
    private _iLoanProductRepository: ILoanProductRepository,
    @inject("ILoanRepository") private _iLoanRepository: ILoanRepository,
    @inject("IEmiRepository") private _iEmiRepository: IEmiRepository,
    @inject("IEmiService") private _iEmiService: IEmiService,
    @inject("INotificationService")
    private readonly _iNotificationService: INotificationService,
  ) {}
  async getUserApplicationList(query: VendorApplicationQueryDTO): Promise<{
    data: VendorApplicationListItemDTO[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const result =
      await this._iUserVerificationRepo.getUserApplicationList(query);
    return result;
  }

  async getApplicationDetail(
    applicationId: string,
    vendorId: string,
  ): Promise<VendorApplicationDetailsDTO> {
    try {
      console.log("STEP 1: Service started");

      console.log("STEP 2: applicationId =", applicationId);
      console.log("STEP 3: vendorId =", vendorId);

      if (!applicationId || !vendorId) {
        console.log("STEP 4: Invalid request triggered");
        throw new CustomError(MESSAGES.INVALID_REQUEST);
      }

      console.log("STEP 5: Calling repository");

      const application =
        await this._iUserVerificationRepo.getApplicationDetails(
          applicationId,
          vendorId,
        );

      console.log("STEP 6: Repository response received");
      console.log("STEP 7: application =", application);

      if (!application) {
        console.log("STEP 8: Application not found");
        throw new CustomError(MESSAGES.LOAN_APPLICATION_NOT_FOUND);
      }

      console.log("STEP 9: Returning application");
      const user = application.user;

      console.log("AADHAAR DOC KEY:", user?.adhaarDoc);
      console.log("PAN DOC KEY:", user?.panDoc);
      console.log(
        "SALARY SLIP KEY:",
        application.personalDetails?.salarySlipUrl,
      );
      // console.log("PROPERTY DOC KEY:", application.homeDetails?.propertyDocUrl);
      console.log(
        "BUSINESS DOC KEY:",
        application.businessDetails?.registrationDocUrl,
      );
      console.log("GOLD IMAGE KEY:", application.goldDetails?.goldImageUrl);

      if (user?.adhaarDoc) {
        user.adhaarDoc = await this._IStorageService.generateSignedUrl(
          user.adhaarDoc,
          3600,
        );
      }

      if (user?.panDoc) {
        user.panDoc = await this._IStorageService.generateSignedUrl(
          user.panDoc,
          3600,
        );
      }

      if (application.personalDetails?.salarySlipUrl) {
        application.personalDetails.salarySlipUrl =
          await this._IStorageService.generateSignedUrl(
            application.personalDetails.salarySlipUrl,
            3600,
          );
      }

      // ---------- HOME LOAN DOC ----------
      if (application.homeDetails?.propertyDocUrl) {
        application.homeDetails.propertyDocUrl =
          await this._IStorageService.generateSignedUrl(
            application.homeDetails.propertyDocUrl,
            3600,
          );
      }

      // ---------- BUSINESS LOAN DOC ----------
      if (application.businessDetails?.registrationDocUrl) {
        application.businessDetails.registrationDocUrl =
          await this._IStorageService.generateSignedUrl(
            application.businessDetails.registrationDocUrl,
            3600,
          );
      }

      // ---------- GOLD LOAN DOC ----------
      if (application.goldDetails?.goldImageUrl) {
        application.goldDetails.goldImageUrl =
          await this._IStorageService.generateSignedUrl(
            application.goldDetails.goldImageUrl,
            3600,
          );
      }

      // console.log("APPLICATION DETAILS", application);

      // console.log("FINAL APPLICATION DTO:", JSON.stringify(application, null, 2));

      return application;
    } catch (error) {
      console.error("❌ SERVICE ERROR:", error);

      throw error;
    }
  }

  async approveLoan(
    applicationId: string,
    vendorId: string,
  ): Promise<{
    success: boolean;
    message: string;
    data: VendorApplicationDetailsDTO;
  }> {
    if (!applicationId || !vendorId) {
      throw new CustomError(MESSAGES.INVALID_REQUEST);
    }

    const existingApplication =
      await this._iUserVerificationRepo.getApplicationDetails(
        applicationId,
        vendorId,
      );

    if (!existingApplication) {
      throw new CustomError(MESSAGES.LOAN_APPLICATION_NOT_FOUND);
    }

    if (existingApplication.status !== "PENDING") {
      throw new CustomError(MESSAGES.ONLY_PENDING_APPLICATIONS_CAN_BE_APPROVED);
    }

    const application = await this._iUserVerificationRepo.approveLoan(
      applicationId,
      vendorId,
    );

    if (!application) {
      throw new CustomError(MESSAGES.LOAN_APPLICATION_NOT_FOUND);
    }

    const loanProduct = await this._iLoanProductRepository.findById(
      application.loanProductId.toString(),
    );

    if (!loanProduct) {
      throw new CustomError(MESSAGES.LOAN_PRODUCT_NOT_FOUND);
    }

    const processingFee = Math.ceil(application.loanAmount * 0.01);
    const netLoanAmount = application.loanAmount - processingFee;

    const loanData = CreateLoanMappers.toEntity(
      {
        user: application.userId,
        loanProduct: application.loanProductId,
        loanAmount: netLoanAmount,
        loanTenure: application.loanTenure,
        applicationId: application._id as mongoose.Types.ObjectId,
      },
      {
        interestRate: loanProduct.interestRate,
        duePenalty: loanProduct.duePenalty,
        processingFee,
        isProcessingFeePaid: false,
      },
    );

    loanData.startDate = new Date();
    const createdLoan = await this._iLoanRepository.create(loanData);

    const emiData = await this._iEmiService.generateEmiSchedule({
      loanId: createdLoan._id as mongoose.Types.ObjectId,
      loanAmount: netLoanAmount,
      tenure: application.loanTenure,
      interestRate: loanProduct.interestRate,
      startDate: createdLoan.startDate ?? new Date(),
    });

    await this._iEmiRepository.createManyEmi(emiData);

    await this._iNotificationService.createNotification({
      userId: application.userId.toString(),
      loanId: createdLoan._id.toString(),
      title: "Loan Approved",
      message: `Your application has been approved.Loan amount ₹${netLoanAmount} has been created successfully.`,
      type: NotificationType.LOAN_APPROVED,
    });

    const updatedApplication = await this.getApplicationDetail(
      applicationId,
      vendorId,
    );

    return {
      success: true,
      message: MESSAGES.LOAN_APPROVED_SUCCESSFULLY,
      data: updatedApplication,
    };
  }

  async rejectedLoan(
    applicationId: string,
    vendorId: string,
    rejectionReason: string,
  ): Promise<{
    success: boolean;
    message: string;
    data: VendorApplicationDetailsDTO;
  }> {
    if (!applicationId || !vendorId) {
      throw new CustomError(MESSAGES.INVALID_REQUEST);
    }

    if (!rejectionReason || !rejectionReason.trim()) {
      throw new CustomError(MESSAGES.REJECTION_REASON_REQUIRED);
    }

    const application = await this._iUserVerificationRepo.getApplicationDetails(
      applicationId,
      vendorId,
    );

    if (!application) {
      throw new CustomError(MESSAGES.LOAN_APPLICATION_NOT_FOUND);
    }

    if (application.status !== "PENDING") {
      throw new CustomError(MESSAGES.ONLY_PENDING_APPLICATIONS_CAN_BE_REJECTED);
    }

    const rejectedLoan = await this._iUserVerificationRepo.rejectLoan(
      applicationId,
      vendorId,
      rejectionReason,
    );

    await this._iNotificationService.createNotification({userId:application.user.toString(), title: "Loan Rejected",
    message: `Your loan application has been rejected. Reason: ${rejectionReason}`,
    type: NotificationType.LOAN_REJECTED})

    if (!rejectedLoan) {
      throw new CustomError(MESSAGES.LOAN_APPLICATION_NOT_FOUND);
    }

    const updatedApplication = await this.getApplicationDetail(
      applicationId,
      vendorId,
    );

    return {
      success: true,
      message: MESSAGES.LOAN_REJECTED_SUCCESSFULLY,
      data: updatedApplication,
    };
  }
}
