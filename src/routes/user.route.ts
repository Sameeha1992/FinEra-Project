import express, { Request, Response, NextFunction } from "express";

import { container } from "../config/di/di.containers";
import { AuthUserController } from "../controllers/user/user/auth.user.controller";
import { validateRequest } from "../middleware/validationRequest";
import { registerUserSchema } from "../validations/user/userRegister.validation";
import { UserProfileController } from "../controllers/user/user/user.profile.controller";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

const authUserController = container.resolve(AuthUserController);
const userProfileController = container.resolve(UserProfileController)
router.post(
  "/generate-otp",
  (req: Request, res: Response, next: NextFunction) => {
    authUserController.generateOtp(req, res, next);
  }
);

router.post(
  "/verify-otp",
  (req: Request, res: Response, next: NextFunction) => {
    authUserController.verifyOtp(req, res, next);
  }
);

router.post("/register",validateRequest(registerUserSchema),
 (req: Request, res: Response, next: NextFunction) => {
  authUserController.register(req, res, next);
});

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  authUserController.Login(req, res, next);
});

router.post("/forget-password",(req:Request,res:Response,next:NextFunction)=>{
  authUserController.forgetPassword(req,res,next);
})

router.post("/verify-forget-otp",(req:Request,res:Response,next:NextFunction)=>{
  authUserController.verifyforgetPassword(req,res,next)
})

router.post("/reset-password",(req:Request,res:Response,next:NextFunction)=>{
  authUserController.resetPassword(req,res,next)
})

router.post("/auth/google",(req:Request,res:Response,next:NextFunction)=>{
  authUserController.googlelogin(req,res,next)
})

router.get("/userProfile",authenticateUser,(req:Request,res:Response,next:NextFunction)=>{
  userProfileController.getProfile(req,res,next)
})

export default router;
