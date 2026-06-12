import { Request, Response } from "express";
import * as paymentsService from "./payments.service";
import * as ordersService from "@/modules/orders/orders.service";
import { clearCart, getCart } from "@/modules/carts/carts.service";
import { PaystackWebhookEvent } from "./payments.types";
import { CartItemType } from "../carts/carts.types";
import { ShippingAddress } from "@/modules/orders/orders.types";
import { generatePaymentReference } from "@/helpers/generate";
import logger from "@/utils/logger";
import db from "@/db";

export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const { id: userId } = res.locals.user;
    const shipping_address = req.body as ShippingAddress;


    const user = await db("users")
      .where({ id: userId })
      .select("email")
      .first();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cartResult = await getCart(userId);
    if (cartResult.error) {
      return res
        .status(cartResult.statusCode)
        .json({ error: cartResult.message });
    }

    const { items } = cartResult.data;
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const cartItems: CartItemType[] = items;

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + Number(item.product_price) * item.quantity,
      0,
    );

    const reference = generatePaymentReference();

    const productIds = cartItems.map((i) => i.product_id);
    const products = await db("products")
      .whereIn("id", productIds)
      .select("id", "stock", "other_images");
    const productsMap = Object.fromEntries(products.map((p) => [p.id, p]));

    const unavailableItems = cartItems.filter(
      (item) => (productsMap[item.product_id]?.stock ?? 0) < item.quantity,
    );

    if (unavailableItems.length > 0) {
      return res.status(400).json({
        error: "Some items are no longer available",
        items: unavailableItems.map((item) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          requested: item.quantity,
          available: productsMap[item.product_id]?.stock ?? 0,
        })),
      });
    }

    const otherImagesMap = Object.fromEntries(
      products.map((p) => [p.id, p.other_images]),
    );

    // Snapshot cart state into Redis — no DB write yet
    await paymentsService.saveCheckoutSnapshot(reference, {
      user_id: userId,
      shipping_address,
      items: cartItems.map((item) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        product_price: Number(item.product_price),
        quantity: item.quantity,
        product_cover_image: item.product_cover_image,
        product_other_images: otherImagesMap[item.product_id] ?? null,
      })),
    });

    const paystackResult = await paymentsService.initializeTransaction({
      email: user.email,
      amount: Math.round(totalAmount * 100), // kobo
      reference,
      metadata: { user_id: userId },
    });

    if (!paystackResult.status) {
      await paymentsService.deleteCheckoutSnapshot(reference);
      return res.status(502).json({ error: "Payment initialization failed" });
    }

    return res.status(200).json({
      message: "Payment initiated",
      data: {
        authorization_url: paystackResult.data.authorization_url,
        reference,
      },
    });
  } catch (error) {
    logger.error("Error initiating payment", { error });
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const signature = req.headers["x-paystack-signature"] as string;

  if (
    !signature ||
    !paymentsService.verifyWebhookSignature(req.body as Buffer, signature)
  ) {
    logger.warn("Webhook: invalid signature", { signature: signature ?? "missing" });
    return res.status(400).json({ error: "Invalid signature" });
  }

  // Respond 200 immediately — Paystack retries on non-200
  res.status(200).send("OK");

  try {
    const event: PaystackWebhookEvent = JSON.parse(
      (req.body as Buffer).toString(),
    );
    console.log(event)

    if (event.event === "charge.success") {
      const snapshot = await paymentsService.claimCheckoutSnapshot(
        event.data.reference,
      );

      if (!snapshot) {
        logger.warn("Webhook: snapshot not found", {
          reference: event.data.reference,
        });
        return;
      }

      const result = await ordersService.createOrderFromSnapshot({
        ...snapshot,
        payment_reference: event.data.reference,
      });

      if (result.error) {
        logger.error("Webhook: order creation failed", { error: result.message });

        const refund = await paymentsService.refundTransaction(event.data.reference);
        if (refund.status) {
          logger.info("Webhook: refund initiated", { reference: event.data.reference, amount: refund.data.amount });
        } else {
          logger.error("Webhook: refund failed — manual action required", { reference: event.data.reference, reason: refund.message });
        }

        return;
      }

      await clearCart(snapshot.user_id);
      logger.info("Webhook: order created and cart cleared", { orderId: result.data });

    }

    if (event.event === "charge.failed") {
      await paymentsService.deleteCheckoutSnapshot(event.data.reference);
      logger.info("Webhook: payment failed, snapshot cleaned up", {
        reference: event.data.reference,
      });
    }
  } catch (error) {
    logger.error("Webhook processing error", { error });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { reference } = req.params;
    const result = await paymentsService.verifyTransaction(reference as string);

    console.log(result.status)

    if (!result.status) {
      return res.status(400).json({ error: result.message });
    }

    return res
      .status(200)
      .json({
        status: result.status,
        message: "Payment verified",
        data: {
          status: result.data.status,
          reference: result.data.reference,
          amount: result.data.amount,
          metadata: result.data.metadata,
          customer: result.data.customer.email

        }
      });
  } catch (error) {
    logger.error("Error verifying payment", { error });
    return res.status(500).json({ error: "Internal server error" });
  }
};