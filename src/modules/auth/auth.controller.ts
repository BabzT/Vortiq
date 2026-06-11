import { Request, Response } from "express";
import * as authService from "@/modules/auth/auth.service";
import { RegisterUserInput, VerifyEmailInput } from "@/modules/auth/auth.types";
import logger from "@/utils/logger";

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
    logger.error("Error registering user", { error });
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
    logger.error("Error verifying email", { error });
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
    logger.error("Error resending verification code", { error });
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });
    if (result.error) {
      return res.status(result.statusCode).json({ error: result.message });
    }
    return res.status(200).json({
      message: "User logged in successfully",
      data: result.data,
    });
  } catch (error) {
    logger.error("Error logging in user", { error });
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    const result = await authService.refreshAccessToken(refreshToken);

    if (result.error) {
      return res.status(result.statusCode).json({ error: result.message });
    }

    return res.status(200).json({
      message: "Access token refreshed successfully",
      data: result.data,
    });
  } catch (error) {
    logger.error("Error refreshing access token", { error });
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    return res.status(200).json({
      message: "Password reset code sent to your email",
    });
  } catch (error) {
    logger.error("Error in forgot password", { error });
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const resendResetOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await authService.resendResetOtp(email);
    return res.status(200).json({
      message: "Password reset code resent to your email",
    });
  } catch (error) {
    logger.error("Error resending reset password code", { error });
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { resetToken, newPassword } = req.body;

    const result = await authService.resetPassword(resetToken, newPassword);

    if (result.error) {
      return res.status(result.statusCode).json({ error: result.message });
    }
    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    logger.error("Error resetting password", { error });
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: "Google ID token is required" });
    }

    const result = await authService.googleAuth(idToken);

    if (result.error) {
      return res.status(result.statusCode).json({ error: result.message });
    }

    return res.status(200).json({
      message: "Google authentication successful",
      data: result.data,
    });
  } catch (error) {
    logger.error("Error in Google authentication", { error });
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required" });
    }
    await authService.logoutUser(refreshToken);
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    logger.error("Error logging out", { error });
    return res.status(500).json({ error: "Internal server error" });
  }
};
