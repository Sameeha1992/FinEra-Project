import { IEmi } from "@/models/emi/emi.model";
import { IBaseRepository } from "../baseRepository.interface";
import { CreateEmiDTO } from "@/dto/emi/create.emi.dto";

export interface IEMIRepository extends IBaseRepository<IEmi>{
    createManyEmi(emiData:CreateEmiDTO[]):Promise<IEmi[]>
    findByLoanId(loanId:string):Promise<IEmi[]>
}