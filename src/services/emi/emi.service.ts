import { MESSAGES } from "@/config/constants/message";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { EmiListingLoans } from "@/dto/emi/create.emi.dto";
import { IEMIRepository } from "@/interfaces/repositories/emi/emi.repository.interface";
import { ILoanRepository } from "@/interfaces/repositories/loan/loan.repository.interface";
import { IEmiService } from "@/interfaces/services/emi/emi.servive.interface";
import { EmiMapper } from "@/mappers/emi/emi.mappers";
import { CustomError } from "@/middleware/errorMiddleware";
import { inject, injectable } from "tsyringe";


@injectable()
export class EmiService implements IEmiService{
    constructor(@inject("IEMIRepository") private _iEmiRepository:IEMIRepository,
                @inject("ILoanRepository") private _iLoanRepository:ILoanRepository){}
    async getEmisByLoanId(loanId: string,userId:string): Promise<EmiListingLoans[]> {
            console.log("service loan:", loanId);

        
        if(!loanId){
                  console.log("loan id missing");

            throw new CustomError(MESSAGES.LOAN_ID_REQUIRED,STATUS_CODES.NOT_FOUND)
        }

        const loan = await this._iLoanRepository.findById(loanId);
        if(!loan){
                  throw new CustomError(MESSAGES.LOAN_NOT_FOUND, STATUS_CODES.NOT_FOUND);

        }

        if (loan.user.toString() !== userId) {
      throw new CustomError(MESSAGES.UNAUTHORIZED_ACCESS, STATUS_CODES.FORBIDDEN);
    }
        const emis = await this._iEmiRepository.findByLoanId(loanId);

        if(!emis || emis.length ===0){
                          console.log("no EMI found for loan:", loanId);

            throw new CustomError(MESSAGES.EMI_NOT_FOUND,STATUS_CODES.NOT_FOUND)
        }


    const mappedEmis = emis.map((emi) => EmiMapper.toListingDto(emi));
    console.log("mapped emis:", mappedEmis);

    return mappedEmis;    }
}
