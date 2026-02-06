import { Response } from "express";
import { isProduction } from "./setAuthCookies";


export const clearAuthCookies = (res:Response)=>{

    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:isProduction,
    
    })
}