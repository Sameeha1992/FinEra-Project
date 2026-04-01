import { container } from "tsyringe";
import { VendorAuthController } from "../vendor/vendor.auth.controller";
import { VendorProfileController } from "../vendor/vendor.profile.controller";
import { AuthMiddleware } from "@/middleware/authMiddleware";
import { LoanProductController } from "../loanProduct/loanProduct.controller";
import { LoanApplicationController } from "../loanApplication/loan.application.controller";
import { UserVerificationController } from "../vendor/user.verification.controller";
import { UserApplicationController } from "../user/user/userApplication/user.application.controller";
import { EmiController } from "../emi/emi.controller";
import { EmiPaymentController } from "../emi/emi.payment.controller";
import { UserNotificationController } from "../user/user/notification/user.notification.controller";
import { ChatController } from "../chat/chat.controller";
import { VendorDashboardController } from "../vendor/vendorDashboard.controller";
import { TransactionController } from "../transactions/transaction.controller";

export const authVendorController = container.resolve(VendorAuthController);
export const vendorProfileController = container.resolve(VendorProfileController);
export const loanProductController = container.resolve(LoanProductController);
export const loanApplicationController = container.resolve(LoanApplicationController) 
export const authMiddleware = container.resolve(AuthMiddleware);

//User:
export const userVerificationController = container.resolve(UserVerificationController)
export const userApplicationController = container.resolve(UserApplicationController)
export const userEmiController = container.resolve(EmiController);
export const emiPaymentController = container.resolve(EmiPaymentController)
//Notification:-

export const userNotificationController = container.resolve(UserNotificationController)

export const chatController = container.resolve(ChatController)

export const vendorDashboardController = container.resolve(VendorDashboardController)


//Transaction:-

export const transactionController = container.resolve(TransactionController)
//Admin:-

