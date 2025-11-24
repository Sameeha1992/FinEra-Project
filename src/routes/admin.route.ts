import { AdminAuthController } from "../controllers/user/admin/auth.admin.controller";
import express,{Request,Response,NextFunction } from "express";
import { container } from "tsyringe";



const adminRouter = express.Router();

const authAdminController = container.resolve(AdminAuthController)

adminRouter.post("/login",(req:Request,res:Response,next:NextFunction)=>{
    authAdminController.login(req,res,next)
})


export default adminRouter