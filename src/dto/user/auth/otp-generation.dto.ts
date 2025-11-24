export interface otpgenerateDto{
    email:string,
    otp:string,
    expiredAt:Date
}


export interface OtpVerifyDto{
    email:string;
    otp:string;
    role:string;
}