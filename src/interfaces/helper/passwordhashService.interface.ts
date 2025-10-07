export interface IPasswordService{
    hashPassword(password:string):Promise<string>
    comparePassword(password:string, hashPassword:string):Promise<boolean>;
}