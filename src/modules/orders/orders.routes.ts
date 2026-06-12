import express from "express";
import { authenticate } from "@/middlewares/authenticate";
import { validateRequestQuery } from "@/middlewares/validate";
import * as ordersController from "@/modules/orders/orders.controller";
import { getOrdersQuerySchema } from "./orders.validation";

const router = express.Router();

router.get("/", authenticate, validateRequestQuery(getOrdersQuerySchema), ordersController.getOrders);
router.get("/:id", authenticate, ordersController.getOrderById);

export default router;
