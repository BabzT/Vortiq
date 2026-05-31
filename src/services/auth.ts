import "dotenv/config";
import db from "@/db";
import bcrypt from "bcrypt";
import { User } from "@/types/user";
import { ResponseType } from "@/types/response";
import {
  RegisterUserInput,
  LoginUserInput,
  VerifyEmailInput,
} from "@/types/auth";
import redis from "@/utils/redis";
import resend from "@/utils/mailer";
import { authQueue } from "@/queues/auth";
import { generateOtp } from "@/helpers/otp";
import { renderEmail } from "@/email-templates/renderer";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/utils/jwt";
import * as usersService from "@/services/users";

export const registerUser = async (
  input: RegisterUserInput,
): Promise<ResponseType<User>> => {
  const { email, password, fullname, phone, auth_provider, provider_user_id } =
    input;

  // Check if user already exists
  const existingUser = await usersService.getUserByEmail(email);

  if (existingUser.error === false) {
    return {
      error: true,
      message: "Email already registered!",
      statusCode: 409,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await db("users")
    .insert({
      email,
      password: hashedPassword,
      fullname,
      phone,
      auth_provider,
      provider_user_id,
    })
    .returning([
      "id",
      "email",
      "fullname",
      "phone",
      "is_verified",
      "is_active",
      "auth_provider",
      "provider_user_id",
      "created_at",
      "updated_at",
    ]);

  const verificationCode = generateOtp();

  await redis.set(`verify-email:${email}`, verificationCode, "EX", 5 * 60);

  await resend.emails.send({
    from: process.env.MAIL_FROM!,
    to: email,
    subject: "Verify your email",
    html: renderEmail("verify-email", {
      subject: "Welcome to Vortiq!",
      firstName: fullname.split(" ")[0],
      email,
      verificationCode,
      expiresIn: "5 minutes",
    }),
  });

  return {
    error: false,
    data: result,
  };
};

export const verifyEmail = async (
  input: VerifyEmailInput,
): Promise<ResponseType<null>> => {
  const { email, code } = input;
  const storedCode = await redis.get(`verify-email:${email}`);

  if (!storedCode || storedCode !== code) {
    return {
      error: true,
      message: "Invalid/Expired verification code",
      statusCode: 400,
    };
  }

  const [user] = await db("users")
    .where({ email })
    .update({ is_verified: true, is_active: true, updated_at: new Date() })
    .returning("fullname");

  const html = renderEmail("verification-success", {
    subject: "Verification Successful!",
    firstName: user.fullname.split(" ")[0],
  });

  await authQueue.add("verification-success", {
    to: email,
    subject: "Verification Successful!",
    html,
  });

  await redis.del(`verify-email:${email}`);

  return {
    error: false,
    data: null,
  };
};

export const resendVerificationCode = async (
  email: string,
): Promise<ResponseType<null>> => {
  const user = await usersService.getUserByEmail(email);

  if (user.error === false) {
    const code = generateOtp();

    await redis.set(`verify-email:${email}`, code, "EX", 5 * 60);

    await resend.emails.send({
      from: process.env.MAIL_FROM!,
      to: email,
      subject: "Your new verification code",
      html: renderEmail("resend-verification", {
        subject: "Your new verification code",
        firstName: user.data.fullname.split(" ")[0],
        email,
        verificationCode: code,
        expiresIn: "5 minutes",
      }),
    });
  }

  return {
    error: false,
    data: null,
  };
};

const loginUser = async (
  input: LoginUserInput,
): Promise<
  ResponseType<{ accessToken: string; refreshToken: string; user: User }>
> => {
  const { email, password } = input;
  const user = await usersService.getUserByEmail(email);

  if (user.error) {
    return {
      error: true,
      message: "Invalid credentials",
      statusCode: 401,
    };
  }

  const isMatch = await bcrypt.compare(password, user.data.password);

  if (!isMatch) {
    return {
      error: true,
      message: "Invalid credentials",
      statusCode: 401,
    };
  }

  const accessToken = generateAccessToken(user.data.id);
  const refreshToken = generateRefreshToken(user.data.id);

  await redis.set(
    `refresh-token:${refreshToken}`,
    user.data.id,
    "EX",
    7 * 24 * 60 * 60,
  );

  return {
    error: false,
    data: { accessToken, refreshToken, user: user.data },
  };
};
