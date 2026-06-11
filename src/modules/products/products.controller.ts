import { Request, Response } from "express";
import * as productsService from "@/modules/products/products.service";
import { GetProductsQuery } from "./products.types";
import logger from "@/utils/logger";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const query = (req as any).parsedQuery as GetProductsQuery;

    const result = await productsService.getProducts(query);

    return res.status(200).json({
      message: "Products fetched successfully",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    logger.error("Error fetching products", { error });
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const result = await productsService.getProductBySlug(slug as string);

    if (result.error) {
      return res.status(result.statusCode).json({ error: result.message });
    }

    res.status(200).json({
      message: "Product fetch successfully",
      data: result.data,
    });
  } catch (error) {
    logger.error("Error fetching product", { error });
    return res.status(500).json({ error: "Internal server error" });
  }
};
