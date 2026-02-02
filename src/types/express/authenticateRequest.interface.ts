import { Role } from "@/models/enums/enum";
import { Request } from "express";

export interface AuthenticateRequest extends Request{
    user?:{
        id:string;
        role:Role;
        email?:string
    }
    file?:Express.Multer.File
}