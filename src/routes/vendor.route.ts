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

router.post("/vendor-login",(req:Request,res:Response,next:NextFunction)=>{
    authVendorController.login(req,res,next)
})






export default router