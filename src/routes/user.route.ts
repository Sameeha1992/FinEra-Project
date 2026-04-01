import express, { Request, Response, NextFunction } from "express";

import { container } from "../config/di/di.containers";
import { AuthUserController } from "../controllers/user/user/auth.user.controller";
import { validateRequest } from "../middleware/validationRequest";
import { registerUserSchema } from "../validations/user/auth/userRegister.validation";
import { UserProfileController } from "../controllers/user/user/user.profile.controller";
import { AuthMiddleware } from "@/middleware/authMiddleware";
import { uploadImageMiddleware } from "@/middleware/multer.middleware";
import { Role } from "@/models/enums/enum";
import multer from "multer";
import {
  emiPaymentController,
  loanApplicationController,
  loanProductController,
  transactionController,
  userApplicationController,
  userEmiController,
  userNotificationController,
} from "@/controllers/resolvers/resolvers";
import { EmiController } from "@/controllers/emi/emi.controller";
import { loginUserSchema } from "@/validations/user/auth/user.login.validation";
import { completeProfileSchema } from "@/validations/user/auth/complete.profile.validation";
import { createEmiPaymentSessionSchema } from "@/validations/emi/emi.payment.validation";

const router = express.Router();

const authUserController = container.resolve(AuthUserController);
const userProfileController = container.resolve(UserProfileController);
const authMiddleware = container.resolve(AuthMiddleware);

router.post(
  "/generate-otp",
  (req: Request, res: Response, next: NextFunction) => {
    authUserController.generateOtp(req, res, next);
  },
);

router.post(
  "/verify-otp",
  (req: Request, res: Response, next: NextFunction) => {
    authUserController.verifyOtp(req, res, next);
  },
);

router.post(
  "/register",
  validateRequest(registerUserSchema),
  authUserController.register.bind(authUserController),
);

router.post(
  "/login",
  validateRequest(loginUserSchema),
  authUserController.login.bind(authUserController),
);

router.post(
  "/forget-password",

  authUserController.forgetPassword.bind(authUserController),
);

router.post(
  "/verify-forget-otp",
  (req: Request, res: Response, next: NextFunction) => {
    authUserController.verifyforgetPassword(req, res, next);
  },
);

router.post(
  "/reset-password",
  (req: Request, res: Response, next: NextFunction) => {
    authUserController.resetPassword(req, res, next);
  },
);

router.post(
  "/auth/google",
  (req: Request, res: Response, next: NextFunction) => {
    authUserController.googlelogin(req, res, next);
  },
);

router.post(
  "/refresh-token",
  (req: Request, res: Response, next: NextFunction) => {
    authUserController.refreshToken(req, res, next);
  },
);

router.patch(
  "/change-password",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.User),
  authMiddleware.checkBlocked,
  authUserController.changePassword.bind(authUserController),
);

router.get(
  "/user-profile",
  authMiddleware.auntenticate,
  authMiddleware.checkBlocked,
  authMiddleware.allowRoles(Role.User),
  userProfileController.getProfile.bind(userProfileController),
);

router.post(
  "/user-complete-profile",
  authMiddleware.auntenticate,
  authMiddleware.checkBlocked,
  authMiddleware.allowRoles(Role.User),
  uploadImageMiddleware.fields([
    { name: "adhaarDoc", maxCount: 1 },
    { name: "panDoc", maxCount: 1 },
    { name: "cibilDoc", maxCount: 1 },
  ]),
  validateRequest(completeProfileSchema),
  userProfileController.completeProfile.bind(userProfileController),
);

router.get(
  "/complete-profile",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.User),
  authMiddleware.checkBlocked,
  userProfileController.getCompleteProfile.bind(userProfileController),
);

router.put(
  "/user-profile",
  authMiddleware.auntenticate,
  authMiddleware.checkBlocked,
  authMiddleware.allowRoles(Role.User),
  uploadImageMiddleware.fields([
    { name: "adhaarDoc", maxCount: 1 },
    { name: "panDoc", maxCount: 1 },
  ]),
  userProfileController.updateCompleteProfile.bind(userProfileController),
);

// router.put("/profile/image",uploadImageMiddleware.single("image"),userProfileController.updateProfileImage.bind(userProfileController))

//   console.log("will come")

// router.put("/profile/image",uploadImageMiddleware.single("image"),(req:Request,res:Response,next:NextFunction)=>{
//   userProfileController.updateProfileImage(req,res,next)

// })

router.post("/logout", (req: Request, res: Response, next: NextFunction) => {
  authUserController.logout(req, res, next);
});

router.get(
  "/loans",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.User),
  authMiddleware.checkBlocked,
  loanProductController.getActiveLoansForUser.bind(loanProductController),
);

router.get(
  "/loans/:loanId",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.User),
  authMiddleware.checkBlocked,
  loanProductController.getLoanDetailsForUser.bind(loanProductController),
);

console.log("coming");

router.post(
  "/create-loan-application",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.User),
  authMiddleware.checkBlocked,

  uploadImageMiddleware.fields([
    { name: "goldImage", maxCount: 1 },
    { name: "propertyDoc", maxCount: 1 },
    { name: "registerationDoc", maxCount: 1 },
    { name: "salarySlipDoc", maxCount: 1 },
  ]),
  (req, res, next) => {
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);
    next();
  },
  loanApplicationController.createLoanApplication.bind(
    loanApplicationController,
  ),
);

router.put(
  "/loans/:applicationId/reapply",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.User),
  authMiddleware.checkBlocked,
  uploadImageMiddleware.fields([
    { name: "goldImage", maxCount: 1 },
    { name: "propertyDoc", maxCount: 1 },
    { name: "registerationDoc", maxCount: 1 },
    { name: "salarySlipDoc", maxCount: 1 },
  ]),
  loanApplicationController.reapplyrejectedLoan.bind(loanApplicationController),
);

router.get(
  "/applications",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.User),
  authMiddleware.checkBlocked,
  userApplicationController.getuserApplicationList.bind(
    userApplicationController,
  ),
);

router.get(
  "/applications/:applicationId",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.User),
  authMiddleware.checkBlocked,
  userApplicationController.getUserApplicationDetails.bind(
    userApplicationController,
  ),
);
router.get(
  "/loan/:loanId/emis",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.User),
  authMiddleware.checkBlocked,
  userEmiController.getEmisByLoanId.bind(userEmiController),
);
router.post(
  "/emis/pay",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.User),
  authMiddleware.checkBlocked,
  validateRequest(createEmiPaymentSessionSchema),
  emiPaymentController.createEmiPaymentSession.bind(emiPaymentController),
);

router.get(
  "/emi/:emiId",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.User),
  authMiddleware.checkBlocked,
  userEmiController.getEmiDetails.bind(userEmiController),
);

//Notification user:

router.get(
  "/notifications",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.User),
  authMiddleware.checkBlocked,
  userNotificationController.getNotifications.bind(userNotificationController),
);

router.patch(
  "/notifications/:notificationId/read",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.User),
  authMiddleware.checkBlocked,
  userNotificationController.markAsRead.bind(userNotificationController),
);

router.patch(
  "/notifications/read-all",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.User),
  authMiddleware.checkBlocked,
  userNotificationController.markAllAsRead.bind(userNotificationController),
);

router.get(
  "/notifications/unread-count",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.User),
  authMiddleware.checkBlocked,
  userNotificationController.getUnreadCount.bind(userNotificationController),
);

router.get(
  "/transactions",
  authMiddleware.auntenticate,
  authMiddleware.allowRoles(Role.User),
  authMiddleware.checkBlocked,
  transactionController.getUserTransactions.bind(transactionController)
);


export default router;
