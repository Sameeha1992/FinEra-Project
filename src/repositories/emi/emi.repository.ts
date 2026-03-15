import Emi, { IEmi } from "@/models/emi/emi.model";
import { BaseRepository } from "../base_repository";
import { IEMIRepository } from "@/interfaces/repositories/emi/emi.repository.interface";
import { CreateEmiDTO } from "@/dto/emi/create.emi.dto";
import { injectable } from "tsyringe";


@injectable()
export class EmiRepository extends BaseRepository<IEmi> implements IEMIRepository{
    constructor(){
        super(Emi)
    }

    async createManyEmi(emiData: CreateEmiDTO[]): Promise<IEmi[]> {
        return await Emi.insertMany(emiData)
    }

    async findByLoanId(loan: string): Promise<IEmi[]> {
        try
        {
            console.log("========== EMI REPOSITORY DEBUG ==========");
      console.log("loanId received in repo:", loan);

const emis = await Emi.find({ loan}).sort({ emiNumber: 1 });

      console.log("EMI documents from DB:", emis);
      console.log("EMI count:", emis.length);

      console.log("========== EMI REPOSITORY END ==========");

      return emis;    
        }catch(error){
            console.log("========== EMI REPOSITORY ERROR ==========");
      console.log("repository error:", error);
      throw error;
        }
    }
}