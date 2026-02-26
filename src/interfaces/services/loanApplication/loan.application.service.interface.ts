import { CreateLoanApplicationDTO } from "@/dto/loanApplication/loanApplication.dto";

export interface ILoanApplicationService{
    createLoanApplication(dto:CreateLoanApplicationDTO,files?:{goldImage?:Express.Multer.File[];propertyDoc?:Express.Multer.File[];registerationDoc?:Express.Multer.File[];salarySlipDoc?:Express.Multer.File[]}):Promise<{success:boolean;message:string}>
}