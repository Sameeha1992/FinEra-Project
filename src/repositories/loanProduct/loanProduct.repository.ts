import { injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import loanProduct, { ILoanProduct } from "@/models/loan/loanProduct.model";
import { ILoanProductRepository } from "@/interfaces/repositories/loanProduct/loanProduct.repository";
import {
  ILoanProductEntityDto,
  LoanItemDto,
  LoanListingDto,
  UpdateLoanDto,
} from "@/dto/loanProduct/loanProduct.dto";
import { FilterQuery } from "mongoose";
import { CustomError } from "@/middleware/errorMiddleware";
import { MESSAGES } from "@/config/constants/message";
import { STATUS_CODES } from "@/config/constants/statusCode";
import loanModel from "@/models/loan/loan.model";
import { LoanStatus, LoanType } from "@/models/enums/enum";
import { LoanListingResult } from "@/dto/loanProduct/loanListingUser";
@injectable()
export class LoanProductRepository
  extends BaseRepository<ILoanProduct>
  implements ILoanProductRepository
{
  constructor() {
    super(loanProduct);
  }
  async findByNameAndVendor(
    name: string,
    vendorId: string,
  ): Promise<any | null> {
    return await loanProduct.findOne({ name, vendor: vendorId });
  }

  async getLoanByVendor(
    vendorId: string,
    search: string = "",
    page: number = 1,
    limit: number = 10,
  ): Promise<LoanListingDto> {
    if (!vendorId) {
      throw new CustomError(
        MESSAGES.UNAUTHORIZED_ACCESS,
        STATUS_CODES.UNAUTHORIZED,
      );
    }

    const query = {
      vendor: vendorId,
      name: { $regex: search || "", $options: "i" },
    };

    const total = await loanProduct.countDocuments(query);

    if (total === 0) {
      throw new CustomError(MESSAGES.NO_LOANS_FOUND, STATUS_CODES.NOT_FOUND);
    }

    const loans = await loanProduct
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("loanId name amount tenure interestRate status loanType")
      .lean();

    const loanItems: LoanItemDto[] = loans.map((loan) => ({
      loanId: loan.loanId,
      name: loan.name,
      amount: `${loan.amount.minimum} -${loan.amount.maximum}`,
      tenure: `${loan.tenure.minimum}-${loan.tenure.maximum} months`,
      interestRate: loan.interestRate.toString(),
      loanType: loan.loanType,
      status: loan.status,
    }));

    return {
      loans: loanItems,
      total,
      page,
      limit,
    };
  }

  async updateLoanByVendor(
    loanId: string,
    vendorId: string,
    updateData: UpdateLoanDto,
  ): Promise<ILoanProduct | null> {
    const updatedLoan = await loanProduct.findOneAndUpdate(
      { loanId, vendor: vendorId },
      { $set: updateData },
      { new: true, runValidators: true },
    );
    return updatedLoan;
  }

  async findByLoanIdAndVendor(
    loanId: string,
    vendorId: string,
  ): Promise<ILoanProduct | null> {
    return loanProduct.findOne({ loanId, vendor: vendorId });
  }

  async getActiveLoansForUsers(
    loanType: LoanType,
    userSalary?:number,
    page: number = 1,
    limit: number = 10,
    search?:string
  ): Promise<LoanListingResult> {
   const skip = (page - 1) * limit;

  // ── Base filter ───────────────────────────────────────────────
  const filter: FilterQuery<ILoanProduct> = {
    loanType,
    status: LoanStatus.ACTIVE,
  };

  console.log("Repository filter:", JSON.stringify(filter, null, 2));

  // ── Apply salary filter only if userSalary is provided ───────
  if (userSalary && userSalary >0) {
    filter.$and = [
      {
        $or: [
          { "eligibility.minSalary": { $lte: userSalary } },
          { "eligibility.minSalary": { $exists: false } },
        ],
      },
    ];
  }

  // console.log("All loans in DB for type:", loanType, await loanProduct.find({}));
  // ── Apply search filter if provided ─────────────────────────
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { "vendor.bankName": { $regex: search, $options: "i" } },
    ];
  }

  // ── Query loans ──────────────────────────────────────────────
  const loans = await loanProduct
    .find(filter)
    .populate("vendor", "vendorName")
    .skip(skip)
    .limit(limit)
    .lean()
    

  const total = await loanProduct.countDocuments(filter);
  console.log("loans in thenreopoditorybhghgb",loans)
  return {
    loans,
    total,
    page,
    limit,
  };
}
}
