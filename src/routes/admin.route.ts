import { AdminVendorMgtController } from "@/controllers/user/admin/admin.vendor.mgt.controller";
import { AdminAuthController } from "../controllers/user/admin/auth.admin.controller";
import express,{Request,Response,NextFunction } from "express";
import { container } from "tsyringe";
import { AdminProfileController } from "@/controllers/user/admin/admin.profile.controller";
import { AuthMiddleware } from "@/middleware/authMiddleware";
import { Role } from "@/models/enums/enum";



const adminRouter = express.Router();

const authAdminController = container.resolve(AdminAuthController)
const adminAccountController = container.resolve(AdminVendorMgtController)
const authMiddleware = container.resolve(AuthMiddleware)

adminRouter.post("/login",(req:Request,res:Response,next:NextFunction)=>{
    authAdminController.login(req,res,next)
})


adminRouter.get("/accounts",(req:Request,res:Response,next:NextFunction)=>{
    adminAccountController.getAccounts(req,res,next)
})

adminRouter.patch("/accounts/:id/status",(req:Request,res:Response,next:NextFunction)=>{
    adminAccountController.updatedStatus(req,res,next)
})

adminRouter.post("/refresh-token",(req:Request,res:Response,next:NextFunction)=>{
    authAdminController.refreshToken(req,res,next)
})

adminRouter.post("/logout",(req:Request,res:Response,next:NextFunction)=>{
    authAdminController.logout(req,res,next)
})

export default adminRouter