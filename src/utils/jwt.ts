import "dotenv/config";
import jwt from "jsonwebtoken";
import { appConfig } from "@/config";

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, appConfig.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "24h",
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, appConfig.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "7d",
  });
};

export const verifyRefreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      appConfig.REFRESH_TOKEN_SECRET as string,
    ) as { id: string };
    return decoded.id;
  } catch (err) {
    return null;
  }
};
