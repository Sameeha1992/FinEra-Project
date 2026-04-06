import { ILoan } from "@/models/loan/loan.model";
import { IBaseRepository } from "../baseRepository.interface";

export interface ILoanRepository extends IBaseRepository<ILoan> {
  findByApplicationId(applicationId: string): Promise<ILoan | null>;
}
