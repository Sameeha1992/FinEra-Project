import { MESSAGES } from "@/config/constants/message";
import { CreateLoanApplicationDTO } from "@/dto/loanApplication/loanApplication.dto";
import { IStorageService } from "@/interfaces/helper/storageService.interface";
import { ILoanApplicationRepository } from "@/interfaces/repositories/loanApplication/loan.application.interface";
import { ILoanApplicationService } from "@/interfaces/services/loanApplication/loan.application.service.interface";
import { CustomError } from "@/middleware/errorMiddleware";
import { ILoanApplication } from "@/models/applications/application.model";
import { LoanType } from "@/models/enums/enum";
import { Types } from "mongoose";
import { inject, injectable } from "tsyringe";
import {v4 as uuid} from "uuid"
@injectable()
export class LoanApplicationService implements ILoanApplicationService{
constructor(@inject("ILoanApplicationRepository") private _iLoanApplicationRepo:ILoanApplicationRepository,
    @inject("IStorageService") private _IStorageService: IStorageService){}

async createLoanApplication(dto: CreateLoanApplicationDTO,files?:{goldImage?:Express.Multer.File[];propertyDoc?:Express.Multer.File[];registerationDoc?:Express.Multer.File[];salarySlipDoc?:Express.Multer.File[]}): Promise<{ success: boolean; message: string; }> {

   //Upload Gold image:-

    if(files?.goldImage?.[0]){
        const key = `loan-applications/gold/${uuid()}`;
        const imageUrl = await this._IStorageService.uploadImage(files.goldImage[0],key);

        dto.goldDetails ={
            ...dto.goldDetails,
            goldImageUrl:imageUrl,
        }
    }

    //Upload Home Document:-

    if(files?.propertyDoc?.[0]){
        const key =`loan-applications/home/${uuid()}`;
        const docUrl = await this._IStorageService.uploadImage(files.propertyDoc[0],key);

        dto.homeDetails ={
            ...dto.homeDetails,
            propertyDocUrl:docUrl
        }
    }

    //Business Registration:-

    if(files?.registerationDoc?.[0]){
        const key =`loan-applications/business/${uuid()}`;
        const regUrl = await this._IStorageService.uploadImage(files.registerationDoc[0],key);
        dto.businessDetails={
            ...dto.businessDetails,
            registrationDocUrl:regUrl
        }
    }

    //Personal Registration:-

    
    if(files?.salarySlipDoc?.[0]){
        const key =`loan-applications/personal/${uuid()}`;
        const salUrl = await this._IStorageService.uploadImage(files.salarySlipDoc[0],key);
        dto.personalDetails={
            ...dto.personalDetails,
            salarySlipUrl:salUrl
        }
    }
    

    switch(dto.loanType){
        case LoanType.PERSONAL:
            if(!dto.personalDetails) throw new CustomError(MESSAGES.PERSONAL_LOAN_DETAILS_REQUIRED);
            break;
        case LoanType.GOLD:
            if(!dto.goldDetails) throw new CustomError(MESSAGES.GOLD_LOAN_DETAILS_REQUIRED);
            break;
        case LoanType.BUSINESS:
            if(!dto.businessDetails) throw new CustomError(MESSAGES.BUSINESS_LOAN_DETAILS_REQUIRED);
            break;
        case LoanType.HOME:
            if(!dto.homeDetails) throw new CustomError(MESSAGES.HOME_LOAN_DETAILS_REQUIRED)            
    }

    const loanData:Partial<ILoanApplication>={
        ...dto,
        userId:new Types.ObjectId(dto.userId),
        vendorId:new Types.ObjectId(dto.vendorId),
        loanProductId:new Types.ObjectId(dto.loanProductId)
    }

    await this._iLoanApplicationRepo.create(loanData);

    return{
        success:true,
        message:MESSAGES.LOAN_APPLICATION_SUBMITTED_SUCCESSFULLY
    }
}

}