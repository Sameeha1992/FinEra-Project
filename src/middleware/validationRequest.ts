import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));

        return res.status(400).json({
          success: false,
          errors: formattedErrors,
        });
      }
      next(error);
    }
  };
};
