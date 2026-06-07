import express from "express";
import { validateRequestQuery } from "@/middlewares/validate";
import { getProductsQuerySchema } from "@/modules/products/products.validation";
import * as productsController from "@/modules/products/products.controller";

const router = express.Router();

router.get(
  "/",
  validateRequestQuery(getProductsQuerySchema),
  productsController.getProducts,
);

router.get("/:slug", productsController.getProductBySlug);

export default router;
