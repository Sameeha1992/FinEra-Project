import mongoose, { Document } from "mongoose";

export interface IOtp {
  email: string;
  otp: string;
  expireAt: Date;
}

