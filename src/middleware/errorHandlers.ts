import { Request, Response, NextFunction } from "express";
import { CustomError } from "./errorMiddleware";
import { MESSAGES } from "@/config/constants/message";
import logger from "./loggerMiddleware";

export const errorHandlers = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error(
    `Error in ${req.method} ${req.originalUrl}: ${
      err instanceof Error ? err.message : String(err)
    }`,
  );
  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }

  res
    .status(500)
    .json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR });
};
