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
