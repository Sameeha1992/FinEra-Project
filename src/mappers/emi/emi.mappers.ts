import { EmiListingLoans } from "@/dto/emi/create.emi.dto";
import { IEmi } from "@/models/emi/emi.model";

export class EmiMapper{
    static toListingDto(emi:IEmi):EmiListingLoans{
        return{
            emiId:emi.id.toString(),
            loan:emi.loan.toString(),
            emiNumber:emi.emiNumber,
            amount:emi.amount,
            dueDate:emi.dueDate,
            status:emi.status,
            penalty:emi.penalty,
            paidAt:emi.paidAt
        }
    }
}