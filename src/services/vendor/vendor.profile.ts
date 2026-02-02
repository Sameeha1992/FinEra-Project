import { MESSAGES } from "@/config/constants/message";
import { VendorProfileResponseDTO } from "@/dto/vendorDto/vendor.profile.dto";
import { IVendorRepository } from "@/interfaces/repositories/vendor/vendor.auth";
import { IVendorProfileService } from "@/interfaces/services/vendor/vendor.profile.interface";
import { vendorProfileMapper } from "@/mappers/vendor/vendor.profile.mapper";
import { CustomError } from "@/middleware/errorMiddleware";
import { inject, injectable } from "tsyringe";


@injectable()
export class VendorProfileService implements IVendorProfileService{
    constructor(@inject("IVendorRepository") private _vendorRepository:IVendorRepository){}
    async getProfile(vendorid: string): Promise<VendorProfileResponseDTO> {
        let user = await this._vendorRepository.findById(vendorid);
        if(!user){
            throw new CustomError(MESSAGES.USER_NOT_FOUND);
        }

        return vendorProfileMapper.toResponse(user)

    }
}