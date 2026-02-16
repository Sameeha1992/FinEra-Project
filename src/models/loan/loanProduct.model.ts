import mongoose, { Schema, Document } from "mongoose";

export interface ILoanProduct extends Document {
  vendor: mongoose.Types.ObjectId;
  loanId: string;
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";

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

  features: string[];
  eligibility: {
    minAge?: number;
    maxAge?: number;
    minSalary?: number;
    minCibilScore?: number;
    otherCriteria?: string[];
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
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
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
    otherCriteria: { type: [String], default: [] }, 
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
