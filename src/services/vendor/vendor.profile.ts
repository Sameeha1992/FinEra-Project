import { MESSAGES } from "@/config/constants/message";
import { VendorCompleteProfileDto, VendorCompleteProfileResponseDto, VendorCompleteUpdateDto, VendorProfileResponseDTO } from "@/dto/vendorDto/vendor.profile.dto";
import { IStorageService } from "@/interfaces/helper/storageService.interface";
import { IVendorRepository } from "@/interfaces/repositories/vendor/vendor.auth";
import { IVendorProfileService } from "@/interfaces/services/vendor/vendor.profile.interface";
import { CompleteVendorProfileMapper, vendorProfileMapper } from "@/mappers/vendor/vendor.profile.mapper";
import { CustomError } from "@/middleware/errorMiddleware";
import { inject, injectable } from "tsyringe";


@injectable()
export class VendorProfileService implements IVendorProfileService{
    constructor(@inject("IVendorRepository") private _vendorRepository:IVendorRepository,
                @inject("IStorageService") private _IStorageService:IStorageService){}
    async getProfile(vendorid: string): Promise<VendorProfileResponseDTO> {
        let user = await this._vendorRepository.findById(vendorid);
        if(!user){
            throw new CustomError(MESSAGES.USER_NOT_FOUND);
        }

        return vendorProfileMapper.toResponse(user)

    }

    async completeProfile(vendorId: string, dto: VendorCompleteProfileDto, files: { registrationDoc?: Express.Multer.File; licenceDoc?: Express.Multer.File; }): Promise<VendorCompleteProfileResponseDto> {
        const vendor = await this._vendorRepository.findById(vendorId);
        if(!vendor){
            throw new CustomError(MESSAGES.USER_NOT_FOUND);
        }

        const fileUrls:{
            registrationDoc?:string,
            licenceDoc?:string
        } ={};

        if(files.registrationDoc){
            const key = `document/registeration/${vendorId}`;
            await this._IStorageService.uploadImage(files.registrationDoc,key)
            fileUrls.registrationDoc = key
        }

        if(files.licenceDoc){
            const key = `document/licence/${vendorId}`
            await this._IStorageService.uploadImage(files.licenceDoc,key);
            fileUrls.licenceDoc = key
        }

        const updatedData = {...CompleteVendorProfileMapper.toEntity(dto,fileUrls),isProfileComplete:true};

        const updateUser = await this._vendorRepository.updateById(vendorId,updatedData);

        if(!updateUser){
            throw new CustomError(MESSAGES.USER_NOT_FOUND)
        }

        return CompleteVendorProfileMapper.toResponse(updateUser)
    }


    async getCompleteProfile(vendorid:string):Promise<VendorCompleteUpdateDto>{

        const user = await this._vendorRepository.findById(vendorid);

        if(!user){
            throw new CustomError(MESSAGES.USER_NOT_FOUND);

        }

        const getSignedUrl = async (docKey?: string)=>{
            if(!docKey) return null;
            return await this._IStorageService.generateSignedUrl(docKey,3600);
        }

        const regsitrationDocUrl = await getSignedUrl(user.registrationDoc);
        const licenceDocUrl = await getSignedUrl(user.licence_Doc);

        const vendorCompleteData:VendorCompleteUpdateDto = {
            name:user.vendorName,
            email:user.email,
            vendorId:user.vendorId,
            registrationNumber:user.registrationNumber,
            licenceNumber:user.licenceNumber,

            documents:{
                registrationDocUrl:regsitrationDocUrl || "",
                licenceDocUrl:licenceDocUrl || ""
            },

        };

        return vendorCompleteData
    }
}