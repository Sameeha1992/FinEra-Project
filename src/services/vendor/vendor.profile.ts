import { MESSAGES } from "@/config/constants/message";
import { VendorCompleteProfileDto, VendorCompleteProfileResponseDto, VendorCompleteUpdateDto, VendorProfileResponseDTO, VendorUpdateProfileDto } from "@/dto/vendorDto/vendor.profile.dto";
import { IStorageService } from "@/interfaces/helper/storageService.interface";
import { IVendorRepository } from "@/interfaces/repositories/vendor/vendor.auth";
import { IVendorProfileService } from "@/interfaces/services/vendor/vendor.profile.interface";
import { CompleteVendorProfileMapper, vendorProfileMapper } from "@/mappers/vendor/vendor.profile.mapper";
import { CustomError } from "@/middleware/errorMiddleware";
import { Status } from "@/models/enums/enum";
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
        const licenceDocUrl = await getSignedUrl(user.licenceDoc);

        const vendorCompleteData:VendorCompleteUpdateDto = {
            name:user.vendorName,
            email:user.email,
            vendorId:user.vendorId,
            registrationNumber:user.registrationNumber,
            licenceNumber:user.licenceNumber,
            isProfileComplete:user.isProfileComplete,

            documents:{
                registrationDocUrl:regsitrationDocUrl || "",
                licenceDocUrl:licenceDocUrl || ""
            },

        };

        return vendorCompleteData
    }



    async updateCompleteProfile(vendorid:string,dto:VendorUpdateProfileDto,files?:{registrationDoc?: Express.Multer.File,licenceDoc?: Express.Multer.File;}):Promise<VendorCompleteProfileResponseDto>{

        const vendor = await this._vendorRepository.findById(vendorid);
        if(!vendor){
            throw new CustomError(MESSAGES.USER_NOT_FOUND)
        }

        if(vendor.isBlocked){
            throw new CustomError(MESSAGES.USER_BLOCKED)
        }

        if(vendor.status === Status.Verified){
            const isTryingToUpdateSensitiveFields = dto.registrationNumber !==undefined || dto.licenceNumber !==undefined || files?.registrationDoc || files?.licenceDoc;

            if(isTryingToUpdateSensitiveFields){
                throw new CustomError(MESSAGES.VERIFIED_USER_KYC_UPDATE_RESTRICTED)
            }
        }

        const updateData = CompleteVendorProfileMapper.toUpdateEntity(dto)

    if(files?.registrationDoc){
        const key = `documents/register/${vendorid}`;
      await this._IStorageService.uploadImage(files.registrationDoc, key);
      updateData.registrationDoc = key;
    }

     if(files?.licenceDoc){
        const key = `documents/licence/${vendorid}`;
      await this._IStorageService.uploadImage(files.licenceDoc, key);
      updateData.licenceDoc = key;
    }

    const updatedUser = await this._vendorRepository.updateById(vendorid,updateData);

    if(!updatedUser){
        throw new CustomError(MESSAGES.USER_NOT_FOUND)
    }
       
    return CompleteVendorProfileMapper.toResponse(updatedUser)
}
}