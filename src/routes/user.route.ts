import { Request,Response,NextFunction } from "express";

import { container } from "../config/di/di.containers";
import { AuthUserController } from "../controllers/user/auth.user.controller";

const authUserController = container.resolve(AuthUserController)

router.post("/register",(req:Request,res:Response,next:NextFunction)=>{
authUserController.register(req,res,next)
})