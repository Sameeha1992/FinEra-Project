import { container } from "tsyringe";
import { VendorAuthController } from "../vendor/vendor.auth.controller";
import { VendorProfileController } from "../vendor/vendor.profile.controller";
import { AuthMiddleware } from "@/middleware/authMiddleware";
import { LoanProductController } from "../loanProduct/loanProduct.controller";
import { LoanApplicationController } from "../loanApplication/loan.application.controller";

export const authVendorController = container.resolve(VendorAuthController);
export const vendorProfileController = container.resolve(VendorProfileController);
export const loanProductController = container.resolve(LoanProductController);
export const loanApplicationController = container.resolve(LoanApplicationController) 
export const authMiddleware = container.resolve(AuthMiddleware);
