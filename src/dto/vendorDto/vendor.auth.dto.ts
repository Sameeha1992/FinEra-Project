export interface VendorRegisterDto{
   name: string,
   email:string,
   registerNumber:string,
   role?:string,
   password:string
}



export interface VendorResponseDto{
    name:string,
    email:string,
    registerNumber:string,
    role?:string,
    createdAt:string,
}
