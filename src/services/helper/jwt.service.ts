import { injectable } from "tsyringe";
import { IJwtService } from "../../interfaces/helper/jwt.service.interface";
import jwt from "jsonwebtoken";
import ms from "ms";
import { env } from "process";

@injectable()
export class JwtService implements IJwtService {
  generateAccessToken(_id: string, role: "user" | "vendor" | "admin"): string {
    const expiry = env.JWT_ACCESS_EXPIRY_IN;

    return jwt.sign({ _id,role }, env.JWT_ACCESS_SECRET as string, {
      expiresIn: env.JWT_ACCESS_EXPIRY_IN as ms.StringValue,
      
    });
  }

  
  generateRefreshToken(_id: string, role: "user" | "vendor" | "admin"): string {
    return jwt.sign({ _id,role }, env.JWT_REFRESH_SECRET as string, {
      expiresIn: env.JWT_REFRESH_EXPIRY_IN as ms.StringValue,
    });
  }

  verifyToken(token: string, type: "access" | "refresh"): any {
    try {
      const secret =
        type === "access"
          ? env.JWT_ACCESS_SECRET
          : env.JWT_REFRESH_SECRET;
      return jwt.verify(token, secret as string);
    } catch (error) {
      return null;
    }
  }
}
