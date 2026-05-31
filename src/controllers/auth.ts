import { Request, Response } from "express";
import * as authService from "@/services/auth";
import { RegisterUserInput, VerifyEmailInput } from "@/types/auth";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const input: RegisterUserInput = req.body;
    const result = await authService.registerUser(input);
    if (result.error) {
      return res.status(result.statusCode).json({ error: result.message });
    }
    return res.status(201).json({
      message: "User registered successfully",
      data: result.data,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const input: VerifyEmailInput = req.body;
    const result = await authService.verifyEmail(input);
    if (result.error) {
      return res.status(result.statusCode).json({ error: result.message });
    }
    return res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const resendVerificationCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await authService.resendVerificationCode(email);
    return res.status(200).json({
      message: "Verification code resent successfully",
    });
  } catch (error) {
    console.error("Error resending verification code:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
