import { injectable } from "tsyringe";
import { IJwtService } from "../../interfaces/helper/jwt.service.interface";
import jwt from "jsonwebtoken";
import ms from "ms";

@injectable()
export class JwtService implements IJwtService {
  generateAccessToken(_id: string, role: "user" | "vendor" | "admin"): string {
    const expiry = process.env.JWT_ACCESS_EXPIRY_IN;
    console.log(expiry,"expiry");

    return jwt.sign({ _id,role }, process.env.JWT_ACCESS_SECRET as string, {
      expiresIn: process.env.JWT_ACCESS_EXPIRY_IN as ms.StringValue,
      
    });
  }

  
  generateRefreshToken(_id: string, role: "user" | "vendor" | "admin"): string {
    return jwt.sign({ _id,role }, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: process.env.JWT_REFRESH_EXPIRY_IN as ms.StringValue,
    });
  }

  verifyToken(token: string, type: "access" | "refresh"): any {
    try {
      const secret =
        type === "access"
          ? process.env.JWT_ACCESS_SECRET
          : process.env.JWT_REFRESH_SECRET;
      return jwt.verify(token, secret as string);
    } catch (error) {
      return null;
    }
  }
}
