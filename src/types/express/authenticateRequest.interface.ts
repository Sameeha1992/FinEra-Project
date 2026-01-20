import { Request } from "express";

export interface AuthenticateRequest extends Request{
    user?:{
        userId:string;
    }
    file?:Express.Multer.File
}