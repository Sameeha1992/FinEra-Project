
import express, { Request, Response, NextFunction } from "express";
import { Role } from "@/models/enums/enum";
import { uploadImageMiddleware } from "@/middleware/multer.middleware";
import { authMiddleware, authVendorController, loanProductController, vendorProfileController } from "@/controllers/resolvers/resolvers";

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
  (req: Request, res: Response, next: NextFunction) => {
    authVendorController.registerVendor(req, res, next);
  },
);

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  authVendorController.login(req, res, next);
});

router.post(
  "/forget-password",
  (req: Request, res: Response, next: NextFunction) => {
    authVendorController.forgetPassword(req, res, next);
  },
);

router.post(
  "/verify-forget-otp",
  (req: Request, res: Response, next: NextFunction) => {
    authVendorController.verifyforgetPassword(req, res, next);
  },
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


router.patch("/change-password",authMiddleware.auntenticate,authMiddleware.allowRoles(Role.Vendor),authMiddleware.checkBlocked,authVendorController.changePassword.bind(authVendorController))

router.post("/logout", (req: Request, res: Response, next: NextFunction) => {
  authVendorController.logout(req, res, next);
});

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
    {name :"registrationDoc",maxCount:1},
    {name:"licenceDoc",maxCount:1}
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


router.post("/loan-product",authMiddleware.auntenticate,authMiddleware.allowRoles(Role.Vendor),authMiddleware.checkBlocked,loanProductController.createLoanProduct.bind(loanProductController))
router.get("/loans",authMiddleware.auntenticate,authMiddleware.allowRoles(Role.Vendor),authMiddleware.checkBlocked,loanProductController.getVendorLoans.bind(loanProductController))
export default router;
