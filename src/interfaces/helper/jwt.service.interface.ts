export interface IDecodedToken {
  _id: string;
  role: "user" | "vendor" | "admin";
  email?: string;
  iat?: number;
  exp: number;
  jti?:string;
}

export interface IJwtService {
  generateAccessToken(_id: string, role: "user" | "vendor" | "admin"): string;
  generateRefreshToken(_id: string, role: "user" | "vendor" | "admin"): string;
  verifyToken(token: string, type: "access" | "refresh"): IDecodedToken | null;
}
