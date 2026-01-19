import { Request,Response,NextFunction } from "express";
import { CustomError } from "./errorMiddleware";
import { success } from "zod";
import { MESSAGES } from "@/config/constants/message";


export const errorHandlers =(
    err:any,
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    if(err instanceof CustomError){
        return res.status(err.statusCode).json({success:false,message:err.message})
    }

    res.status(500).json({success:false,message:MESSAGES.INTERNAL_SERVER_ERROR})
}