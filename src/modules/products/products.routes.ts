import express from "express";
import {
  validateRequestParams,
  validateRequestQuery,
} from "@/middlewares/validate";
import {
  getProductParamSchema,
  getProductsQuerySchema,
} from "@/modules/products/products.validation";
import * as productsController from "@/modules/products/products.controller";

const router = express.Router();

router.get(
  "/",
  validateRequestQuery(getProductsQuerySchema),
  productsController.getProducts,
);

router.get(
  "/:slug",
  validateRequestParams(getProductParamSchema),
  productsController.getProductBySlug,
);

export default router;
