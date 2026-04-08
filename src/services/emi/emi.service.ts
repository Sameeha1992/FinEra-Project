import { MESSAGES } from "@/config/constants/message";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { CreateEmiDTO, EmiListingLoans } from "@/dto/emi/create.emi.dto";
import { GenerateEmiScheduleInput } from "@/dto/emi/emi.calculation.dto";
import { EmiListingPageDto, EmiStatisticsDto } from "@/dto/emi/emi.statistic.dto";
import { IEmiRepository } from "@/interfaces/repositories/emi/emi.repository.interface";
import { ILoanRepository } from "@/interfaces/repositories/loan/loan.repository.interface";
import { IEmiService } from "@/interfaces/services/emi/emi.servive.interface";
import { EmiMapper } from "@/mappers/emi/emi.mappers";
import { CustomError } from "@/middleware/errorMiddleware";
import { EmiStatus } from "@/models/enums/enum";
import { inject, injectable } from "tsyringe";

@injectable()
export class EmiService implements IEmiService {
  constructor(
    @inject("IEmiRepository") private _iEmiRepository: IEmiRepository,
    @inject("ILoanRepository") private _iLoanRepository: ILoanRepository,
  ) {}
  async getEmisByLoanId(
    loanId: string,
    userId: string,
  ): Promise<EmiListingPageDto> {
    console.log("service loan:", loanId);

    if (!loanId) {
      console.log("loan id missing");

      throw new CustomError(MESSAGES.LOAN_ID_REQUIRED, STATUS_CODES.NOT_FOUND);
    }

    const loan = await this._iLoanRepository.findById(loanId);
    if (!loan) {
      throw new CustomError(MESSAGES.LOAN_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    if (loan.user.toString() !== userId) {
      throw new CustomError(
        MESSAGES.UNAUTHORIZED_ACCESS,
        STATUS_CODES.FORBIDDEN,
      );
    }
    const emis = await this._iEmiRepository.findByLoanId(loanId);

    if (!emis || emis.length === 0) {
      console.log("no EMI found for loan:", loanId);

      throw new CustomError(MESSAGES.EMI_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    const mappedEmis = emis.map((emi) => EmiMapper.toListingDto(emi));
    console.log("mapped emis:", mappedEmis);

    const statistics = this.buildEmiStatistics(mappedEmis)
    return {
      statistics,
      emis:mappedEmis
      
    }
  }

  async generateEmiSchedule(data: GenerateEmiScheduleInput): Promise<CreateEmiDTO[]> {
    const { loanId, loanAmount, tenure, interestRate, startDate } = data;
    if (!loanId || !loanAmount || !tenure || interestRate === undefined) {
      throw new CustomError(MESSAGES.INVALID_REQUEST, STATUS_CODES.BAD_REQUEST);
    }

    const emiStartDate = startDate ? new Date(startDate) : new Date();
      const monthlyRate = interestRate / 12 / 100;

const emiAmount = Number(
    (
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1)
    ).toFixed(2)
  );
    const emiData: CreateEmiDTO[] = [];

    for (let i = 1; i <= tenure; i++) {
      const dueDate = new Date(emiStartDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      emiData.push({
        loan: loanId,
        emiNumber: i,
        amount: emiAmount,
        dueDate,
        status: EmiStatus.UPCOMING,
        penalty: 0,
      });
    }
    return emiData
  }

  async getEmiDetails(emiId:string,userId:string):Promise<EmiListingLoans>{


    if(!emiId || !userId){
      throw new CustomError(MESSAGES.INVALID_REQUEST,STATUS_CODES.BAD_REQUEST)
    }
    const emi = await this._iEmiRepository.findById(emiId);
    if(!emi){
      throw new CustomError(MESSAGES.EMI_NOT_FOUND,STATUS_CODES.NOT_FOUND)
    }

    const loan = await this._iLoanRepository.findById(emi.loan.toString());
    if(!loan){
      throw new CustomError(MESSAGES.LOAN_NOT_FOUND,STATUS_CODES.NOT_FOUND)
    }

    if(loan.user.toString() !== userId){
      throw new CustomError(MESSAGES.UNAUTHORIZED_ACCESS,STATUS_CODES.FORBIDDEN)
    }

    if(emi.status !== EmiStatus.PAID){
      throw new CustomError(MESSAGES.ONLY_PAID_EMI_DETAILS_CAN_BE_VIEWED,STATUS_CODES.BAD_REQUEST)
    }

    return EmiMapper.toListingDto(emi)
  }

  private buildEmiStatistics(emis:EmiListingLoans[]):EmiStatisticsDto{

    const totalEmiCount = emis.length;

    const paidEmis = emis.filter((emi)=>emi.status === EmiStatus.PAID);

    const paidEmiCount = paidEmis.length;

    const remainingEmiCount = totalEmiCount - paidEmiCount;

    const totalPaidAmount = paidEmis.reduce((sum,emi)=>sum +emi.amount,0);

    const totalEmiAmount = emis.reduce((sum,emi)=>sum+emi.amount,0);

    const remainingBalanceAmount = totalEmiAmount - totalPaidAmount;

    const overdueCount = emis.filter((emi)=>emi.status === EmiStatus.OVERDUE).length;

    const unpaidEmis = emis.filter((emi)=>emi.status !== EmiStatus.PAID).sort((a,b)=>new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),);

    const nextEmiDueDate = unpaidEmis.length > 0 ? unpaidEmis[0].dueDate :null;

    return {
      totalEmiCount,
    paidEmiCount,
    remainingEmiCount,
    totalPaidAmount,
    remainingBalanceAmount,
    nextEmiDueDate,
    overdueCount,
    }

  }

}
