import express from "express";
import * as cartsController from "@/modules/carts/carts.controller";
import { authenticate } from "@/middlewares/authenticate";
import { validateRequestBody } from "@/middlewares/validate";
import { addToCartSchema, updateCartItemSchema } from "./carts.validation";

const router = express.Router();

router.get("/", authenticate, cartsController.getCart);
router.post("/", authenticate, validateRequestBody(addToCartSchema), cartsController.addToCart);
router.patch(
  "/items/:itemId",
  authenticate,
  validateRequestBody(updateCartItemSchema),
  cartsController.updateCartItem,
);
router.delete("/items/:itemId", authenticate, cartsController.removeCartItem);
router.delete("/", authenticate, cartsController.clearCart);

export default router;
