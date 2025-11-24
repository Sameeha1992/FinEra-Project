import express, { Request, Response, NextFunction } from "express";

import { container } from "../config/di/di.containers";
import { AuthUserController } from "../controllers/user/user/auth.user.controller";

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

router.post("/register", (req: Request, res: Response, next: NextFunction) => {
    console.log("register otp")
  authUserController.register(req, res, next);
});

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
    console.log("nmmuk login cheyyam")
  authUserController.Login(req, res, next);
});

export default router;
