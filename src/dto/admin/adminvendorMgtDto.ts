export interface UserVendorResponseDto{
    id:string,
    vendorId?:string,
    customerId?:string,
    name:string,
    email:string,
    accountStatus?:string,
    registrationNumber?:string,
    role:"vendor" |"user"
}