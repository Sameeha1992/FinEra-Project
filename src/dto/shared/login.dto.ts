import { Role } from "../../models/enums/enum";


export interface LoginDto{
    email:string,
    password:string,
}


export interface LoginResponseDto{
    name:string,
    email:string,
    role:Role.User|Role.Admin|Role.Vendor,
    Id:string
    status?:string
    isProfileComplete?:boolean

    

}
