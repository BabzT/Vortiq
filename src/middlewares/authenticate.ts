import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { appConfig } from "@/config";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    res.locals.user = jwt.verify(token, appConfig.ACCESS_TOKEN_SECRET) as {
      id: string;
    };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
