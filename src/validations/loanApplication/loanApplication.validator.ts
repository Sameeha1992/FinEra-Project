import { z } from "zod";
import { LoanType } from "@/models/enums/enum";

export const createLoanApplicationSchema = z.object({
  vendorId: z.string().min(1, "VendorId is required"),
  loanProductId: z.string().min(1, "LoanProductId is required"),

  loanType: z.nativeEnum(LoanType),

  phoneNumber: z.string().min(10),
  employmentType: z.string().min(1),

  // ✅ Use coerce for FormData numbers
  monthlyIncome: z.coerce.number().positive(),
  loanAmount: z.coerce.number().positive(),
  loanTenure: z.coerce.number().positive(),

  personalDetails: z
    .object({
      employerName: z.string().optional(),
      yearsOfExperience: z.coerce.number().optional(),
      purpose: z.string().optional(),
    })
    .optional(),

  goldDetails: z
    .object({
      goldWeight: z.coerce.number().optional(),
      goldImageUrl: z.string().optional(),
    })
    .optional(),

  homeDetails: z
    .object({
      propertyValue: z.coerce.number().optional(),
      propertyLocation: z.string().optional(),
      propertyType: z.string().optional(),
      propertyDocUrl: z.string().optional(),
    })
    .optional(),

  businessDetails: z
    .object({
      businessName: z.string().optional(),
      businessType: z.string().optional(),
      annualRevenue: z.coerce.number().optional(),
      registrationDocUrl: z.string().optional(),
    })
    .optional(),
});