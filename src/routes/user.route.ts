import express, { Request, Response, NextFunction } from "express";

import { container } from "../config/di/di.containers";
import { AuthUserController } from "../controllers/user/user/auth.user.controller";
import { validateRequest } from "../middleware/validationRequest";
import { registerUserSchema } from "../validations/user/userRegister.validation";

const router = express.Router();

const authUserController = container.resolve(AuthUserController);

router.post(
  "/generate-otp",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Entering genertae otp")
    authUserController.generateOtp(req, res, next);
  }
);

router.post(
  "/verify-otp",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Entering verify otp")
    authUserController.verifyOtp(req, res, next);
  }
);

router.post("/register",validateRequest(registerUserSchema),
 (req: Request, res: Response, next: NextFunction) => {
    console.log("register otp")
  authUserController.register(req, res, next);
});

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
    console.log("nmmuk login cheyyam")
  authUserController.Login(req, res, next);
});

router.post("/forget-password",(req:Request,res:Response,next:NextFunction)=>{
  console.log("forget password set")
  authUserController.forgetPassword(req,res,next);
})

router.post("/verify-forget-otp",(req:Request,res:Response,next:NextFunction)=>{
  console.log("verify forget password controller")
  authUserController.verifyforgetPassword(req,res,next)
})

router.post("/reset-password",(req:Request,res:Response,next:NextFunction)=>{
  console.log("reset password ok aai")
  authUserController.resetPassword(req,res,next)
})

router.post("/auth/google",(req:Request,res:Response,next:NextFunction)=>{
  console.log("google auth working");
  authUserController.googlelogin(req,res,next)
})

export default router;
