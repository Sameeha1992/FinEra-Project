import { MESSAGES } from "@/config/constants/message";
import { AdminProfileDto } from "@/dto/admin/admin.profile.dto";
import { IAdminAuthRepo } from "@/interfaces/repositories/admin/admin.auth.repo.interface";
import { IAdminProfileService } from "@/interfaces/services/admin/admin.profile.interface";
import { AdminProfileMapper } from "@/mappers/admin/admin.profile.mappers";
import { CustomError } from "@/middleware/errorMiddleware";
import { inject, injectable } from "tsyringe";

@injectable()
export class AdminProfileService implements IAdminProfileService{
    constructor(@inject("IAdminAuthRepo") private _adminRepo:IAdminAuthRepo){}
    async getAdminProfile(adminId: string): Promise<AdminProfileDto> {
        let admin = await this._adminRepo.findById(adminId)
        if(!admin) throw new CustomError(MESSAGES.USER_NOT_FOUND);
        return AdminProfileMapper.toResponse(admin)
    }
}