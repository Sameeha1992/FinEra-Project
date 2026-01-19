import { VendorAuthController } from '../controllers/user/vendor/vendor.auth.controller';
import express, { Request,Response,NextFunction } from 'express'
import { container } from 'tsyringe';


const router = express.Router();

const authVendorController = container.resolve(VendorAuthController)


router.post('/generate-otp',(req:Request,res:Response,next:NextFunction)=>{
    authVendorController.generateOtp(req,res,next)
})

router.post('/verify-otp',(req:Request,res:Response,next:NextFunction)=>{
    authVendorController.verifyOtp(req,res,next)
})

router.post('/vendor-register',(req:Request,res:Response,next:NextFunction)=>{
 authVendorController.registerVendor(req,res,next)
})

router.post("/login",(req:Request,res:Response,next:NextFunction)=>{
    authVendorController.login(req,res,next)
})


router.post("/forget-password",(req:Request,res:Response,next:NextFunction)=>{
  authVendorController.forgetPassword(req,res,next);
})

router.post("/verify-forget-otp",(req:Request,res:Response,next:NextFunction)=>{
  authVendorController.verifyforgetPassword(req,res,next)
})

router.post("/reset-password",(req:Request,res:Response,next:NextFunction)=>{
  authVendorController.resetPassword(req,res,next)
})

router.post("/auth/google",(req:Request,res:Response,next:NextFunction)=>{
  authVendorController.googlelogin(req,res,next)
})







export default router