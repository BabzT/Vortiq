import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";

export const validateRequestBody = (bodySchema: ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = bodySchema.strip().safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues.map((e) => e.message).join(", ");
      return res.status(400).send({ message: message || "Validation error" });
    }
    req.body = result.data;
    next();
  };
};

export const validateRequestQuery = (querySchema: ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = querySchema.strip().safeParse(req.query);
    if (!result.success) {
      const message = result.error.issues.map((e) => e.message).join(", ");
      return res.status(400).send({ message: message || "Validation error" });
    }
    (req as any).parsedQuery = result.data;
    next();
  };
};
