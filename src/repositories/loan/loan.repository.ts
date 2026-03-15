import Loan,{ ILoan } from "@/models/loan/loan.model";
import { BaseRepository } from "../base_repository";
import { ILoanRepository } from "@/interfaces/repositories/loan/loan.repository.interface";
import { injectable } from "tsyringe";


@injectable()
export class LoanRepository extends BaseRepository<ILoan> implements ILoanRepository{
constructor(){
  super(Loan)
}
async findByApplicationId(applicationId:string):Promise<ILoan |null>{
  return await Loan.findOne({applicationId})
}
}