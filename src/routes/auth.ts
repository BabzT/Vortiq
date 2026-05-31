import express from "express";
import * as authController from "@/controllers/auth";
import {
  registerSchema,
  resendVerificationSchema,
  verifyEmailSchema,
} from "@/validators/auth";
import { validateRequestBody } from "@/middlewares/validate";

const router = express.Router();

// Register route
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

export default router;
