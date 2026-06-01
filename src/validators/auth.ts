import { z } from "zod";

export const registerSchema = z
  .object({
    email: z
      .email({ message: "Please provide a valid email address" })
      .max(255)
      .trim()
      .transform((val) => val.toLowerCase()),
    password: z
      .string({ message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(100),
    fullname: z
      .string({ message: "Full name is required" })
      .min(2, { message: "Full name must be at least 2 characters long" })
      .max(255),
    phone: z
      .string({ message: "Phone number is required" })
      .min(10, { message: "Phone number must be at least 10 characters long" })
      .max(20, { message: "Phone number must be at most 20 characters long" })
      .optional(),
    auth_provider: z.enum(["email", "google"]).optional(),
    provider_user_id: z.string().max(255).optional(),
  })
  .strict();

export const verifyEmailSchema = z
  .object({
    email: z
      .email({ message: "Please provide a valid email address" })
      .max(255)
      .trim()
      .transform((val) => val.toLowerCase()),
    code: z
      .string({ message: "Verification code is required" })
      .min(6, {
        message: "Verification code must be at least 6 characters long",
      })
      .max(100, {
        message: "Verification code must be at most 100 characters long",
      }),
  })
  .strict();

export const resendVerificationSchema = z
  .object({
    email: z
      .email({ message: "Please provide a valid email address" })
      .max(255)
      .trim()
      .transform((val) => val.toLowerCase()),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z
      .email({ message: "Please provide a valid email address" })
      .min(2, { message: "Email must be at least 5 characters long" })
      .max(255)
      .trim()
      .transform((val) => val.toLowerCase()),
    password: z
      .string({ message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(100),
  })
  .strict();

export const refreshTokenSchema = z
  .object({
    refreshToken: z
      .string({ message: "Refresh token is required" })
      .min(10, { message: "Refresh token must be at least 10 characters long" })
      .max(500, {
        message: "Refresh token must be at most 500 characters long",
      }),
  })
  .strict();

export const forgotPasswordSchema = z
  .object({
    email: z
      .email({ message: "Please provide a valid email address" })
      .max(255)
      .trim()
      .transform((val) => val.toLowerCase()),
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    resetToken: z
      .string({ message: "Reset token is required" })
      .min(6, { message: "Reset token must be at least 6 characters long" })
      .max(6, { message: "Reset token must be at most 6 characters long" }),
    newPassword: z
      .string({ message: "New password is required" })
      .min(6, { message: "New password must be at least 6 characters long" })
      .max(100, {
        message: "New password must be at most 100 characters long",
      }),
  })
  .strict();
