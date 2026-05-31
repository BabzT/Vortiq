import { Request, Response, NextFunction } from "express";
import { ZodError, ZodObject } from "zod";

export const validateRequestBody = (bodySchema: ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      bodySchema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message: string = err.issues.map((e) => e.message).join(", ");

        if (err.issues[0]?.code === "unrecognized_keys") {
          return res
            .status(400)
            .send({ message: "Invalid fields in request body" });
        }
        return res.status(400).send({ message: message || "Validation error" });
      }
      res.status(400).json({ message: "Validation error" });
    }
  };
};

export const validateRequestParams = (paramsSchema: ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      paramsSchema.parse(req.params);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message: string = err.issues.map((e) => e.message).join(", ");
        return res.status(400).send({ message: message || "Validation error" });
      }
      res.status(400).json({ message: "Validation error" });
    }
  };
};
