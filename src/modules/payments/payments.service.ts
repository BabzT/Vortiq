import crypto from "crypto";
import { appConfig } from "@/config";
import redis from "@/utils/redis";
import {
  CheckoutSnapshot,
  PaystackInitializeInput,
  PaystackInitializeResponse,
  PaystackRefundResponse,
  PaystackVerifyResponse,
} from "./payments.types";

const SNAPSHOT_TTL = 1800; // 30 minutes

export const initializeTransaction = async (
  input: PaystackInitializeInput,
): Promise<PaystackInitializeResponse> => {
  const response = await fetch(`${appConfig.PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${appConfig.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return response.json() as Promise<PaystackInitializeResponse>;
};

export const verifyTransaction = async (
  reference: string,
): Promise<PaystackVerifyResponse> => {
  const response = await fetch(
    `${appConfig.PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${appConfig.PAYSTACK_SECRET_KEY}`,
      },
    },
  );

  return response.json() as Promise<PaystackVerifyResponse>;
};

export const refundTransaction = async (
  reference: string,
): Promise<PaystackRefundResponse> => {
  const response = await fetch(`${appConfig.PAYSTACK_BASE_URL}/refund`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${appConfig.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ transaction: reference }),
  });

  return response.json() as Promise<PaystackRefundResponse>;
};

export const verifyWebhookSignature = (
  rawBody: Buffer,
  signature: string,
): boolean => {
  const hash = crypto
    .createHmac("sha512", appConfig.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest("hex");
  return hash === signature;
};

export const saveCheckoutSnapshot = async (
  reference: string,
  snapshot: CheckoutSnapshot,
): Promise<void> => {
  await redis.setex(
    `checkout:${reference}`,
    SNAPSHOT_TTL,
    JSON.stringify(snapshot),
  );
};

// Atomic get-and-delete: only one webhook handler can claim this snapshot.
// A second concurrent request (Paystack retry) gets null and exits early.
export const claimCheckoutSnapshot = async (
  reference: string,
): Promise<CheckoutSnapshot | null> => {
  const data = await redis.getdel(`checkout:${reference}`);
  return data ? (JSON.parse(data) as CheckoutSnapshot) : null;
};

export const deleteCheckoutSnapshot = async (
  reference: string,
): Promise<void> => {
  await redis.del(`checkout:${reference}`);
};