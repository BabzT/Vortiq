import { Request, Response } from "express";
import * as ordersService from "./orders.service";
import { GetOrdersQuery } from "./orders.types"
import logger from "@/utils/logger";

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { id: userId } = res.locals.user;
    const query = (req as any).parsedQuery as GetOrdersQuery;

    const result = await ordersService.getOrders(userId, query);

    return res
      .status(200)
      .json({
        message: "Orders fetched successfully", data: result.data,
        pagination: result.pagination,
      });
  } catch (error) {
    logger.error("Error fetching orders", { error });
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id: userId } = res.locals.user;
    const { id: orderId } = req.params;
    const result = await ordersService.getOrderById(userId, orderId as string);

    if (result.error) {
      return res.status(result.statusCode).json({ error: result.message });
    }

    return res
      .status(200)
      .json({ message: "Order fetched successfully", data: result.data });
  } catch (error) {
    logger.error("Error fetching order", { error });
    return res.status(500).json({ error: "Internal server error" });
  }
};