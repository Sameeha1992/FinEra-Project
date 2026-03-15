import { ILoanApplicationRepository } from "@/interfaces/repositories/loanApplication/loan.application.interface";
import LoanApplication, { ILoanApplication } from "@/models/applications/application.model";
import { inject, injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import { LoanType } from "@/models/enums/enum";

@injectable()
export class LoanApplicationRepository extends BaseRepository<ILoanApplication> implements ILoanApplicationRepository{
      constructor(){
        super(LoanApplication)
      }

      async existingActiveLoans(userId:string,loanType:LoanType):Promise<boolean>{
        const loan = await LoanApplication.findOne({userId,loanType,status:{$in:["PENDING","APPROVED"]}})
        return !!loan
      }

    
}