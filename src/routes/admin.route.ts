import { AdminVendorMgtController } from "@/controllers/admin/admin.vendor.mgt.controller";
import { AdminAuthController } from "../controllers/admin/auth.admin.controller";
import express,{Request,Response,NextFunction } from "express";
import { container } from "tsyringe";
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
    authMiddleware.auntenticate,authMiddleware.allowRoles(Role.Admin),adminAccountController.getAccounts(req,res,next)
})

adminRouter.patch("/accounts/:id/status",(req:Request,res:Response,next:NextFunction)=>{
    authMiddleware.auntenticate,authMiddleware.allowRoles(Role.Admin),adminAccountController.updatedStatus(req,res,next)
})

adminRouter.post("/refresh-token",(req:Request,res:Response,next:NextFunction)=>{
    authAdminController.refreshToken(req,res,next)
})

adminRouter.post("/logout",(req:Request,res:Response,next:NextFunction)=>{
    authAdminController.logout(req,res,next)
})

export default adminRouter