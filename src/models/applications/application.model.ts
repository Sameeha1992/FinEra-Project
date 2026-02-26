import { Document, Types } from "mongoose";

export interface ILoanApplication extends Document {
  userId: Types.ObjectId;
  vendorId:Types.ObjectId;
  loanProductId: Types.ObjectId;

  loanType: "PERSONAL" | "GOLD" | "HOME" | "BUSINESS";

  phoneNumber: string;
  employmentType: string;
  monthlyIncome: number;
  loanAmount: number;
  loanTenure: number;

  personalDetails?: {
    employerName?: string;
    yearsOfExperience?: number;
    purpose?: string;
  };

  goldDetails?: {
    goldWeight?: number;
  };

  homeDetails?: {
    propertyValue?: number;
    propertyLocation?: string;
  };

  businessDetails?: {
    businessName?: string;
    annualRevenue?: number;
  };

  status: "PENDING" | "APPROVED" | "REJECTED";

  createdAt: Date;
  updatedAt: Date;
}




import mongoose, { Schema } from "mongoose";

const loanApplicationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    loanProductId: {
      type: Schema.Types.ObjectId,
      ref: "Loan",
      required: true,
    },

    loanType: {
      type: String,
      enum: ["PERSONAL", "GOLD", "HOME", "BUSINESS"],
      required: true,
    },

    phoneNumber: { type: String, required: true },
    employmentType: { type: String, required: true },
    monthlyIncome: { type: Number, required: true },
    loanAmount: { type: Number, required: true },
    loanTenure: { type: Number, required: true },

    personalDetails: {
      employerName: String,
      yearsOfExperience: Number,
      purpose: String,
    },

    goldDetails: {
      goldWeight: Number,
    },

    homeDetails: {
      propertyValue: Number,
      propertyLocation: String,
    },

    businessDetails: {
      businessName: String,
      annualRevenue: Number,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const LoanApplication = mongoose.model<ILoanApplication>(
  "LoanApplication",
  loanApplicationSchema
);

export default LoanApplication;