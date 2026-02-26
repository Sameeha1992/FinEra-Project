import { ILoanApplicationRepository } from "@/interfaces/repositories/loanApplication/loan.application.interface";
import LoanApplication, { ILoanApplication } from "@/models/applications/application.model";
import { inject, injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";

@injectable()
export class LoanApplicationRepository extends BaseRepository<ILoanApplication> implements ILoanApplicationRepository{
      constructor(){
        super(LoanApplication)
      }
    
}