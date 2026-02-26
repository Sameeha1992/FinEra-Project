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






export interface AuthenticateFileRequest extends Request{
    user?:{
        id:string;
        role:Role;
        email?:string
    }
     files?: {
    adhaarDoc?: Express.Multer.File[];
    panDoc?: Express.Multer.File[];
    cibilDoc?: Express.Multer.File[];
    registrationDoc?:Express.Multer.File[];
    licenceDoc?:Express.Multer.File[]

     goldImage?: Express.Multer.File[];
    propertyDoc?: Express.Multer.File[];
    registerationDoc?: Express.Multer.File[];
    salarySlipDoc?: Express.Multer.File[];
  };
}




export interface AuthenticateApplicationRequest extends Request {
  user?: {
    id: string;
    role: Role;
    email?: string;
  };
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}