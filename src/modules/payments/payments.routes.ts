import express from "express";
import * as paymentsController from "./payments.controller";
import { authenticate } from "@/middlewares/authenticate";
import { validateRequestBody } from "@/middlewares/validate";
import { initiatePaymentSchema } from "@/modules/orders/orders.validation";

const router = express.Router();

router.post(
  "/initiate",
  authenticate,
  validateRequestBody(initiatePaymentSchema),
  paymentsController.initiatePayment,
);
// No auth — Paystack calls this directly
router.post("/webhook", paymentsController.handleWebhook);

router.get(
  "/verify/:reference",
  authenticate,
  paymentsController.verifyPayment,
);

export default router;