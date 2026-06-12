import "dotenv/config";

const env = process.env;

export const appConfig = {
  NODE_ENV: env.NODE_ENV as string,
  PORT: env.PORT as string,
  DB_HOST: env.DB_HOST as string,
  DB_PORT: env.DB_PORT as string,
  DB_USER: env.DB_USER as string,
  DB_PASSWORD: env.DB_PASSWORD as string,
  DB_NAME: env.DB_NAME as string,
  USER_PASSWORD: env.USER_PASSWORD as string,
  ACCESS_TOKEN_SECRET: env.ACCESS_TOKEN_SECRET as string,
  REFRESH_TOKEN_SECRET: env.REFRESH_TOKEN_SECRET as string,
  REDIS_HOST: env.REDIS_HOST as string,
  REDIS_PORT: env.REDIS_PORT as string,
  REDIS_PASSWORD: env.REDIS_PASSWORD as string,
  RESEND_API_KEY: env.RESEND_API_KEY as string,
  MAIL_FROM: env.MAIL_FROM as string,
  GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID as string,
  AWS_REGION: env.AWS_REGION as string,
  AWS_ACCESS_KEY_ID: env.AWS_ACCESS_KEY_ID as string,
  AWS_SECRET_ACCESS_KEY: env.AWS_SECRET_ACCESS_KEY as string,
  AWS_S3_BUCKET: env.AWS_S3_BUCKET as string,
  PAYSTACK_BASE_URL: env.PAYSTACK_BASE_URL as string,
  PAYSTACK_SECRET_KEY: env.PAYSTACK_SECRET_KEY as string,
  PAYSTACK_PUBLIC_KEY: env.PAYSTACK_PUBLIC_KEY as string,
};

const REQUIRED_KEYS: (keyof typeof appConfig)[] = [
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "REDIS_HOST",
  "REDIS_PORT",
  "RESEND_API_KEY",
  "MAIL_FROM",
  "GOOGLE_CLIENT_ID",
  "AWS_REGION",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_S3_BUCKET",
];

export const validateConfig = () => {
  const missing = REQUIRED_KEYS.filter((key) => !appConfig[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
  console.log("No missing configs!");
};
