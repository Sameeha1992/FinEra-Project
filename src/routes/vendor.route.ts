import express, { Request, Response, NextFunction } from "express";
import { Role } from "@/models/enums/enum";
import { uploadImageMiddleware } from "@/middleware/multer.middleware";
import {
  authMiddleware,
  authVendorController,
  loanProductController,
  userVerificationController,
  vendorProfileController,
  vendorDashboardController,
  transactionController,
} from "@/controllers/resolvers/resolvers";
import { validateRequest } from "@/middleware/validationRequest";
import { vendorRegisterSchema } from "@/validations/vendor/vendor.register.validation";
import { vendorLoginSchema } from "@/validations/vendor/vendor.login.validation";
import { vendorForgetPasswordSchema } from "@/validations/vendor/vendor.forgetPassword.validation";
import { verifyForgetOtpSchema } from "@/validations/vendor/verifyForgetOtp.validation";

const router = express.Router();

router.post(
  "/generate-otp",
  (req: Request, res: Response, next: NextFunction) => {
    authVendorController.generateOtp(req, res, next);
  },
);

router.post(
  "/verify-otp",
  (req: Request, res: Response, next: NextFunction) => {
    authVendorController.verifyOtp(req, res, next);
  },
);

router.post(
  "/vendor-register",
  validateRequest(vendorRegisterSchema),

  authVendorController.registerVendor.bind(authVendorController),
);

router.post(
  "/login",
  validateRequest(vendorLoginSchema),
  authVendorController.login.bind(authVendorController),
);

router.post(
  "/forget-password",
  validateRequest(vendorForgetPasswordSchema),
  authVendorController.forgetPassword.bind(authVendorController),
);

router.post(
  "/verify-forget-otp",
  validateRequest(verifyForgetOtpSchema),
  authVendorController.verifyforgetPassword.bind(authVendorController),
);

router.post(
  "/reset-password",
  (req: Request, res: Response, next: NextFunction) => {
    authVendorController.resetPassword(req, res, next);
  },
);

router.post(
  "/auth/google",
  (req: Request, res: Response, next: NextFunction) => {
    authVendorController.googlelogin(req, res, next);
  },
);

router.post(
  "/refresh-token",
  (req: Request, res: Response, next: NextFunction) => {
    authVendorController.refreshToken(req, res, next);
  },
);

router.patch(
  "/change-password",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.Vendor),
  authMiddleware.checkBlocked,
  authVendorController.changePassword.bind(authVendorController),
);

router.post("/logout", (req: Request, res: Response, next: NextFunction) => {
  authVendorController.logout(req, res, next);
});

router.get(
  "/dashboard",
  authMiddleware.auntenticate,
  authMiddleware.checkBlocked,
  authMiddleware.allowRoles(Role.Vendor),
  vendorDashboardController.getDashboardData.bind(vendorDashboardController),
);

router.get(
  "/dashboard/export",
  authMiddleware.auntenticate,
  authMiddleware.checkBlocked,
  authMiddleware.allowRoles(Role.Vendor),
  vendorDashboardController.exportDashboardData.bind(vendorDashboardController),
);

router.get(
  "/vendor-profile",
  authMiddleware.auntenticate,
  authMiddleware.checkBlocked,
  authMiddleware.allowRoles(Role.Vendor),
  vendorProfileController.getVendorProfile,
);

router.post(
  "/vendor-complete-profile",
  authMiddleware.auntenticate,
  authMiddleware.checkBlocked,
  authMiddleware.allowRoles(Role.Vendor),
  uploadImageMiddleware.fields([
    { name: "registrationDoc", maxCount: 1 },
    { name: "licenceDoc", maxCount: 1 },
  ]),
  vendorProfileController.completeProfile,
);

router.get(
  "/vendor-complete-profile",
  authMiddleware.auntenticate,
  authMiddleware.checkBlocked,
  authMiddleware.allowRoles(Role.Vendor),
  vendorProfileController.getCompleteProfile,
);

router.put(
  "/vendor-profile",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.Vendor),
  authMiddleware.checkBlocked,
  uploadImageMiddleware.fields([
    { name: "registrationDoc", maxCount: 1 },
    { name: "licenceDoc", maxCount: 1 },
  ]),
  vendorProfileController.updateCompleteVendorProfile.bind(
    vendorProfileController,
  ),
);

router.post(
  "/loan-product",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.Vendor),
  authMiddleware.checkBlocked,
  loanProductController.createLoanProduct.bind(loanProductController),
);
router.get(
  "/loans",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.Vendor),
  authMiddleware.checkBlocked,
  loanProductController.getVendorLoans.bind(loanProductController),
);
router.get(
  `/loans/:loanId`,
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.Vendor),
  authMiddleware.checkBlocked,
  loanProductController.getLoanById.bind(loanProductController),
);
router.put(
  "/loans/:loanId",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.Vendor),
  authMiddleware.checkBlocked,
  loanProductController.updateLoanByVendor.bind(loanProductController),
);
router.get(
  "/loans/:loanId",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.Vendor),
  authMiddleware.checkBlocked,
  loanProductController.getLoanDetails.bind(loanProductController),
);

//Applications of the user:-

router.get(
  "/applications",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.Vendor),
  authMiddleware.checkBlocked,
  userVerificationController.getUserApplicationList.bind(
    userVerificationController,
  ),
);
router.get(
  "/applications/:id",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.Vendor),
  authMiddleware.checkBlocked,
  userVerificationController.getApplicationDetail.bind(
    userVerificationController,
  ),
);
router.patch(
  "/applications/:id/approve",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.Vendor),
  authMiddleware.checkBlocked,
  userVerificationController.approveLoan.bind(userVerificationController),
);
router.patch(
  "/applications/:id/reject",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.Vendor),
  authMiddleware.checkBlocked,
  userVerificationController.rejectLoan.bind(userVerificationController),
);

router.get(
  "/transactions",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.Vendor),
  authMiddleware.checkBlocked,
  transactionController.getVendorTransactions.bind(transactionController)
);


router.get(
  "/transactions/report",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.Vendor),
  authMiddleware.checkBlocked,
  transactionController.downloadVendorTransactionReport.bind(transactionController),
);


export default router;
