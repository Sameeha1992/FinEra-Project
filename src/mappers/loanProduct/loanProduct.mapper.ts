import {
  ILoanProductDto,
  ILoanProductEntityDto,
  ILoanProductResponseDto,
} from "@/dto/loanProduct/loanProduct.dto";
import { ILoanProduct } from "@/models/loan/loanProduct.model";
import mongoose, { HydratedDocument } from "mongoose";

export class LoanProductMapper {
  static toEntity(
    dto: ILoanProductDto,
    vendorId: string,
    loanId: string,
  ): ILoanProductEntityDto {
    return {
      vendor: new mongoose.Types.ObjectId(vendorId),
      loanId: loanId,

      name: dto.name,
      description: dto.description,

      amount: {
        minimum: dto.amount.minimum,
        maximum: dto.amount.maximum,
      },

      tenure: {
        minimum: dto.tenure.minimum,
        maximum: dto.tenure.maximum,
      },

      interestRate: dto.interestRate,
      duePenalty: dto.duePenalty,

      status: dto.status as "ACTIVE" | "INACTIVE",

      features: dto.features ?? [],
      eligibility: {
        minAge: dto.eligibility?.minAge,
        maxAge: dto.eligibility?.maxAge,
        minSalary: dto.eligibility?.minSalary,
        minCibilScore: dto.eligibility?.minCibilScore,
        otherCriteria: dto.eligibility?.otherCriteria ?? [],
      },
    };
  }

  static toResponse(entity: ILoanProduct): ILoanProductResponseDto {
    return {
      loanId: entity.loanId,

      name: entity.name,
      description: entity.description,

      amount: entity.amount,
      tenure: entity.tenure,

      interestRate: entity.interestRate,
      duePenalty: entity.duePenalty,

      status: entity.status,

      features: entity.features,
      eligibility: {
        minAge: entity.eligibility?.minAge,
        maxAge: entity.eligibility?.maxAge,
        minSalary: entity.eligibility?.minSalary,
        minCibilScore: entity.eligibility?.minCibilScore,
        otherCriteria: entity.eligibility?.otherCriteria ?? [],
      },
    };
  }
}
