import express, { Request, Response, NextFunction } from "express";

import { container } from "../config/di/di.containers";
import { AuthUserController } from "../controllers/user/user/auth.user.controller";
import { validateRequest } from "../middleware/validationRequest";
import { registerUserSchema } from "../validations/user/userRegister.validation";
import { UserProfileController } from "../controllers/user/user/user.profile.controller";
import { AuthMiddleware } from "@/middleware/authMiddleware";
import { uploadImageMiddleware } from "@/middleware/multer.middleware";
import { Role } from "@/models/enums/enum";

const router = express.Router();

const authUserController = container.resolve(AuthUserController);
const userProfileController = container.resolve(UserProfileController);
const authMiddleware = container.resolve(AuthMiddleware)

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


router.post("/refresh-token",(req:Request,res:Response,next:NextFunction)=>{
  authUserController.refreshToken(req,res,next)
})

router.get("/user-profile",authMiddleware.auntenticate,authMiddleware.checkBlocked,authMiddleware.allowRoles(Role.User),userProfileController.getProfile.bind(userProfileController))


router.put("/profile/image",uploadImageMiddleware.single("image"),userProfileController.updateProfileImage.bind(userProfileController))

//   console.log("will come")

router.put("/profile/image",uploadImageMiddleware.single("image"),(req:Request,res:Response,next:NextFunction)=>{
  userProfileController.updateProfileImage(req,res,next)

})

router.post("/logout",(req:Request,res:Response,next:NextFunction)=>{
  authUserController.logout(req,res,next)
})
export default router;
