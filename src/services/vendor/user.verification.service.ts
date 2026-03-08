import { MESSAGES } from "@/config/constants/message";
import {
  VendorApplicationQueryDTO,
  VendorApplicationListItemDTO,
  VendorApplicationDetailsDTO,
} from "@/dto/vendorDto/user.verification.list.dto";
import { IStorageService } from "@/interfaces/helper/storageService.interface";
import { IUserVerificationRepo } from "@/interfaces/repositories/vendor/user.verification.interface";
import { IUserVerificationService } from "@/interfaces/services/vendor/user.verification.interface";
import { CustomError } from "@/middleware/errorMiddleware";
import { inject, injectable } from "tsyringe";

@injectable()
export class UserVerificationService implements IUserVerificationService {
  constructor(
    @inject("IUserVerificationRepo")
    private _iUserVerificationRepo: IUserVerificationRepo,
    @inject("IStorageService") private _IStorageService:IStorageService
  ) {}
  async getUserApplicationList(
    query: VendorApplicationQueryDTO,
  ): Promise<{
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
console.log("SALARY SLIP KEY:", application.personalDetails?.salarySlipUrl);
console.log("PROPERTY DOC KEY:", application.homeDetails?.propertyDocUrl);
console.log("BUSINESS DOC KEY:", application.businessDetails?.registrationDocUrl);
console.log("GOLD IMAGE KEY:", application.goldDetails?.goldImageUrl);

    if (user?.adhaarDoc) {
    user.adhaarDoc = await this._IStorageService.generateSignedUrl(user.adhaarDoc,3600);
  }

  if (user?.panDoc) {
    user.panDoc = await this._IStorageService.generateSignedUrl(user.panDoc,3600);
  }


  if (application.personalDetails?.salarySlipUrl) {
    application.personalDetails.salarySlipUrl =
      await this._IStorageService.generateSignedUrl(
        application.personalDetails.salarySlipUrl,3600
      );
  }

  // ---------- HOME LOAN DOC ----------
  if (application.homeDetails?.propertyDocUrl) {
    application.homeDetails.propertyDocUrl =
      await this._IStorageService.generateSignedUrl(
        application.homeDetails.propertyDocUrl,3600
      );
  }

  // ---------- BUSINESS LOAN DOC ----------
  if (application.businessDetails?.registrationDocUrl) {
    application.businessDetails.registrationDocUrl =
      await this._IStorageService.generateSignedUrl(
        application.businessDetails.registrationDocUrl,3600
      );
  }

  // ---------- GOLD LOAN DOC ----------
  if (application.goldDetails?.goldImageUrl) {
    application.goldDetails.goldImageUrl =
      await this._IStorageService.generateSignedUrl(
        application.goldDetails.goldImageUrl,3600
      );
  }

   console.log("APPLICATION DETAILS",application)
    return application;

  } catch (error) {

    console.error("❌ SERVICE ERROR:", error);

    throw error;
  }
}
}
