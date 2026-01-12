import { Role } from "../../../models/enums/enum";

export interface UserRegisterDTO{
    name:string,
    email:string,
    password?:string,
    customerId:string;
}


export interface RegisterResponseDto{
    name:string,
    email:string,
    role:Role.User|Role.Vendor|Role.Admin,
    customerId:string,
    
}