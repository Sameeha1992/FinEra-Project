import { MESSAGES } from "@/config/constants/message";
import { STATUS_CODES } from "@/config/constants/statusCode";
import {
  UpdateVendorStatusDto,
  VendorDetailDTO,
  VendorVerificationListDto,
} from "@/dto/admin/vendor.verification.dto";
import { IStorageService } from "@/interfaces/helper/storageService.interface";
import { IVendorVerifcationRepository } from "@/interfaces/repositories/admin/vendor.verification.repo.interface";
import { IVendorVerificationService } from "@/interfaces/services/admin/vendor.verification.service.interface";
import { CustomError } from "@/middleware/errorMiddleware";
import { Status } from "@/models/enums/enum";
import { inject, injectable } from "tsyringe";

@injectable()
export class VendorVerificationService implements IVendorVerificationService {
  constructor(
    @inject("IVendorVerifcationRepository")
    private _IvendorVerificationRepo: IVendorVerifcationRepository,
    @inject("IStorageService") private _IstorageService:IStorageService
  ) {}
  async getVendorList(
    page: number,
    limit: number,
  ): Promise<{
    vendors: VendorVerificationListDto[];
    total: number;
    currentPages: number;
    totalPages: number;
  }> {
    const { vendors, total } = await this._IvendorVerificationRepo.getAllVendor(
      page,
      limit,
    );

    const vendorDTO: VendorVerificationListDto[] = vendors.map((vendor) => ({
      vendorId: vendor.vendorId,
      vendorName: vendor.vendorName,
      email: vendor.email,
      status: vendor.status,
      accountStatus: vendor.accountStatus,
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      vendors: vendorDTO,
      total,
      currentPages: page,
      totalPages,
    };
  }

  async getVendorDetails(vendorId: string): Promise<VendorDetailDTO> {
    const vendor = await this._IvendorVerificationRepo.findByVendorId(vendorId);

    if (!vendor) {
      throw new CustomError(MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    const registerationDoc = vendor.registrationDoc ? await this._IstorageService.generateSignedUrl(vendor.registrationDoc, 3600) : undefined;
    const licenceDoc = vendor.licenceDoc ? await this._IstorageService.generateSignedUrl(vendor.licenceDoc,3600):undefined;

    const vendorDto: VendorDetailDTO = {
      vendorId: vendor.vendorId,
      vendorName: vendor.vendorName,
      email: vendor.email,
      registrationNumber: vendor.registrationNumber,
      licenceNumber: vendor.licenceNumber,
      registrationDoc: registerationDoc,
      licenceDoc: licenceDoc,
      status: vendor.status,
      isProfileComplete: vendor.isProfileComplete,
      isBlocked: vendor.isBlocked,
      role: vendor.role,
      accountStatus: vendor.accountStatus,
      createdAt: vendor.createdAt,
      updatedAt: vendor.updatedAt,
      uploadedAt: vendor.uploadedAt,
    };

    return vendorDto
  }

  async updateVendorStatus(vendorId: string, status: Status): Promise<UpdateVendorStatusDto> {
    
    const vendor = await this._IvendorVerificationRepo.updateVendorStatus(vendorId,status);
    if(!vendor){
      throw new CustomError(MESSAGES.USER_NOT_FOUND)
    }

    return {
      vendorId:vendor.vendorId,
      status:vendor.status
    }
  }
}
