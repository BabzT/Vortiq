import express from "express";
import * as authController from "@/controllers/auth";
import {
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "@/validators/auth";
import { validateRequestBody } from "@/middlewares/validate";
import { authenticate } from "@/middlewares/authenticate";

const router = express.Router();

router.post(
  "/register",
  validateRequestBody(registerSchema),
  authController.registerUser,
);

router.post(
  "/verify-email",
  validateRequestBody(verifyEmailSchema),
  authController.verifyEmail,
);

router.post(
  "/resend-email-verification",
  validateRequestBody(resendVerificationSchema),
  authController.resendVerificationCode,
);

router.post(
  "/login",
  validateRequestBody(loginSchema),
  authController.loginUser,
);

router.post(
  "/refresh-token",
  validateRequestBody(refreshTokenSchema),
  authController.refreshAccessToken,
);

router.post(
  "/forgot-password",
  validateRequestBody(forgotPasswordSchema),
  authController.forgotPassword,
);

router.post(
  "/resend-reset-otp",
  validateRequestBody(forgotPasswordSchema),
  authController.resendResetOtp,
);

router.post(
  "/reset-password",
  validateRequestBody(resetPasswordSchema),
  authController.resetPassword,
);

router.post(
  "/logout",
  validateRequestBody(refreshTokenSchema),
  authenticate,
  authController.logoutUser,
);

export default router;
