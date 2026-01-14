export interface UserVendorResponseDto{
    id:string,
    name:string,
    email:string,
    status?:string,
    registrationNumber?:string,
    role:"vendor" |"user"
}