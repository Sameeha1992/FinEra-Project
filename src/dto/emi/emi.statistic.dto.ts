import { EmiListingLoans } from "./create.emi.dto";

export interface EmiStatisticsDto{
    totalEmiCount:number,
    paidEmiCount:number,
    remainingEmiCount:number,
    totalPaidAmount:number,
    remainingBalanceAmount:number,
    nextEmiDueDate:Date |null,
    overdueCount:number,
}

export interface EmiListingPageDto{
    statistics:EmiStatisticsDto;
    emis:EmiListingLoans[]
}