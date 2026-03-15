import { container } from "tsyringe";
import { VendorAuthController } from "../vendor/vendor.auth.controller";
import { VendorProfileController } from "../vendor/vendor.profile.controller";
import { AuthMiddleware } from "@/middleware/authMiddleware";
import { LoanProductController } from "../loanProduct/loanProduct.controller";
import { LoanApplicationController } from "../loanApplication/loan.application.controller";
import { UserVerificationController } from "../vendor/user.verification.controller";
import { UserApplicationController } from "../user/user/userApplication/user.application.controller";
import { EmiController } from "../emi/emi.controller";

export const authVendorController = container.resolve(VendorAuthController);
export const vendorProfileController = container.resolve(VendorProfileController);
export const loanProductController = container.resolve(LoanProductController);
export const loanApplicationController = container.resolve(LoanApplicationController) 
export const authMiddleware = container.resolve(AuthMiddleware);

//User:
export const userVerificationController = container.resolve(UserVerificationController)
export const userApplicationController = container.resolve(UserApplicationController)
export const userEmiController = container.resolve(EmiController)