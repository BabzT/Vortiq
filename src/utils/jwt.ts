import "dotenv/config";
import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "1h",
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "7d",
  });
};

export const verifyRefreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as { id: string };
    return decoded.id;
  } catch (err) {
    return null;
  }
};
