export interface IJwtService{
    generateAccessToken(_id:string,role:"user"|"vendor"|"admin"):string;
    generateRefreshToken(_id:string,role:"user"|"vendor"|"admin"):string;
    verifyToken(token:string,type:"access" |"refresh"):any
}