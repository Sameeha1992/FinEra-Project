// src/@types/express/index.d.ts
import { Role } from "@/models/enums/enum";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
      };
    }
  }
}
