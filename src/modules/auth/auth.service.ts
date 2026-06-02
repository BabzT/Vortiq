import "dotenv/config";
import db from "@/db";
import bcrypt from "bcrypt";
import { User } from "@/modules/users/user.types";
import { ResponseType } from "@/types/response";
import {
  RegisterUserInput,
  LoginUserInput,
  VerifyEmailInput,
} from "./auth.types";
import redis from "@/utils/redis";
import resend from "@/utils/mailer";
import { authQueue } from "./auth.queue";
import { generateOtp } from "@/helpers/otp";
import { renderEmail } from "@/email-templates/renderer";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/utils/jwt";
import * as usersService from "@/modules/users/users.service";
import { verifyGoogleToken } from "@/utils/google";

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

export const loginUser = async (
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

  const isMatch = await bcrypt.compare(password, user.data.password as string);

  if (!isMatch) {
    return {
      error: true,
      message: "Invalid credentials",
      statusCode: 401,
    };
  }

  if (!user.data.is_verified) {
    return {
      error: true,
      message: "Please verify your email before logging in",
      statusCode: 401,
    };
  }

  if (!user.data.is_active) {
    return {
      error: true,
      message: "Your account is deactivated",
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
    data: {
      accessToken,
      refreshToken,
      user: {
        id: user.data.id,
        fullname: user.data.fullname,
        email: user.data.email,
        phone: user.data.phone,
        is_verified: user.data.is_verified,
        is_active: user.data.is_active,
        auth_provider: user.data.auth_provider,
        provider_user_id: user.data.provider_user_id,
        created_at: user.data.created_at,
        updated_at: user.data.updated_at,
      },
    },
  };
};

export const refreshAccessToken = async (
  refreshToken: string,
): Promise<ResponseType<{ accessToken: string }>> => {
  const userId = await verifyRefreshToken(refreshToken);

  if (!userId) {
    return {
      error: true,
      message: "Invalid refresh token",
      statusCode: 401,
    };
  }

  const storedToken = await redis.get(`refresh-token:${refreshToken}`);

  if (!storedToken || storedToken !== userId) {
    return {
      error: true,
      message: "Invalid refresh token",
      statusCode: 401,
    };
  }

  const accessToken = generateAccessToken(userId);

  return {
    error: false,
    data: { accessToken },
  };
};

export const forgotPassword = async (
  email: string,
): Promise<ResponseType<null>> => {
  const user = await usersService.getUserByEmail(email);

  if (user.error === false) {
    const resetToken = generateOtp();
    await redis.set(`reset-password:${resetToken}`, user.data.id, "EX", 5 * 60);

    const html = renderEmail("forgot-password", {
      subject: "Reset Your Password",
      firstName: user.data.fullname.split(" ")[0],
      resetCode: resetToken,
      expiresIn: "5 minutes",
    });

    await resend.emails.send({
      from: process.env.MAIL_FROM!,
      to: email,
      subject: "Reset Your Password",
      html,
    });
  }

  return {
    error: false,
    data: null,
  };
};

export const resendResetOtp = async (
  email: string,
): Promise<ResponseType<null>> => {
  const user = await usersService.getUserByEmail(email);

  if (user.error === false) {
    const resetToken = generateOtp();

    await redis.set(`reset-password:${resetToken}`, user.data.id, "EX", 5 * 60);

    const html = renderEmail("forgot-password", {
      subject: "Reset Your Password",
      firstName: user.data.fullname.split(" ")[0],
      resetCode: resetToken,
      expiresIn: "5 minutes",
    });

    await resend.emails.send({
      from: process.env.MAIL_FROM!,
      to: email,
      subject: "Reset Your Password",
      html,
    });
  }

  return {
    error: false,
    data: null,
  };
};

export const resetPassword = async (
  resetToken: string,
  newPassword: string,
): Promise<ResponseType<null>> => {
  const userId = await redis.get(`reset-password:${resetToken}`);

  if (!userId) {
    return {
      error: true,
      message: "Invalid or expired reset token",
      statusCode: 400,
    };
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const [user] = await db("users")
    .where({ id: userId })
    .update({ password: hashedPassword, updated_at: new Date() })
    .returning(["email", "fullname"]);

  await redis.del(`reset-password:${resetToken}`);

  const html = renderEmail("reset-password-success", {
    subject: "Password Reset Successful",
    firstName: user.fullname.split(" ")[0],
  });

  await authQueue.add("password-reset-success", {
    to: user.email,
    subject: "Password Reset Successful",
    html,
  });

  return {
    error: false,
    data: null,
  };
};

export const googleAuth = async (
  token: string,
): Promise<
  ResponseType<{ accessToken: string; refreshToken: string; user: User }>
> => {
  let payload;
  try {
    payload = await verifyGoogleToken(token);
  } catch {
    return { error: true, message: "Invalid Google token", statusCode: 401 };
  }

  if (!payload?.email || !payload?.sub) {
    return { error: true, message: "Invalid Google token", statusCode: 401 };
  }

  const email: string = payload.email;
  const googleId: string = payload.sub;
  const fullname: string = email.split("@")[0];

  let user: User | undefined = await db("users")
    .where({ provider_user_id: googleId })
    .orWhere({ email })
    .first();

  if (user && user.auth_provider === "email") {
    return {
      error: true,
      message:
        "An account with this email already exists. Please log in with your password.",
      statusCode: 409,
    };
  }

  if (!user) {
    [user] = await db("users")
      .insert({
        email,
        fullname,
        password: null,
        phone: null,
        auth_provider: "google",
        provider_user_id: googleId,
        is_verified: true,
        is_active: true,
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

    console.log(fullname);

    const html = renderEmail("verification-success", {
      subject: "Welcome to Vortiq!",
      firstName: fullname,
    });

    await authQueue.add("google-welcome", {
      to: email,
      subject: "Welcome to Vortiq!",
      html,
    });
  }

  if (!user) {
    return { error: true, message: "Internal server error", statusCode: 500 };
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await redis.set(
    `refresh-token:${refreshToken}`,
    user.id,
    "EX",
    7 * 24 * 60 * 60,
  );

  return {
    error: false,
    data: { accessToken, refreshToken, user },
  };
};

export const logoutUser = async (
  refreshToken: string,
): Promise<ResponseType<null>> => {
  await redis.del(`refresh-token:${refreshToken}`);
  return {
    error: false,
    data: null,
  };
};
