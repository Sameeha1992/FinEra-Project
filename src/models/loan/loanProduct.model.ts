import mongoose, { Schema, Document } from "mongoose";
import { LoanStatus, LoanType } from "../enums/enum";

export interface ILoanProduct extends Document {
  vendor: mongoose.Types.ObjectId;
  loanId: string;
  name: string;
  description: string;
  status: LoanStatus;
  loanType: LoanType;

  amount: {
    minimum: number;
    maximum: number;
  };

  tenure: {
    minimum: number;
    maximum: number;
  };

  interestRate: number;
  duePenalty: number;
  processingFee: number;

  features: string[];
  eligibility: {
    minAge?: number;
    maxAge?: number;
    minSalary?: number;
    minCibilScore?: number;
    
  };
  createdAt: Date;
  updatedAt: Date;
}

const LoanProductSchema = new Schema<ILoanProduct>(
  {
    loanId: {
      type: String,
      required: true,
      unique: true,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(LoanStatus),
      default: LoanStatus.ACTIVE,
    },

    loanType: {
      type: String,
      enum: Object.values(LoanType),
      required: true,
    },

    amount: {
      minimum: {
        type: Number,
        required: true,
      },
      maximum: {
        type: Number,
        required: true,
      },
    },

    tenure: {
      minimum: {
        type: Number,
        required: true,
      },
      maximum: {
        type: Number,
        required: true,
      },
    },

    interestRate: {
      type: Number,
      required: true,
    },
    processingFee: {
      type: Number,
      required: true,
    },

    duePenalty: {
      type: Number,
      required: true,
    },

    features: {
      type: [String],
      default: [],
    },
    eligibility: {
      type: {
        minAge: { type: Number },
        maxAge: { type: Number },
        minSalary: { type: Number },
        minCibilScore: { type: Number },
      },
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

LoanProductSchema.index({ vendor: 1, name: 1 }, { unique: true });

export default mongoose.model<ILoanProduct>("LoanProduct", LoanProductSchema);
