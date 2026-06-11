import { Request, Response } from "express";
import * as cartsService from "@/modules/carts/carts.service";
import { AddToCartInput, UpdateCartItemInput } from "./carts.types";
import logger from "@/utils/logger";

export const getCart = async (req: Request, res: Response) => {
  try {
    const { id: userId } = res.locals.user
    const result = await cartsService.getCart(userId);

    if (result.error) {
      return res.status(result.statusCode).json({ error: result.message });
    }

    return res.status(200).json({ message: "Cart fetched successfully", data: result.data });
  } catch (error) {
    logger.error("Error fetching carts", { error });
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { id: userId } = res.locals.user;
    const input = req.body as AddToCartInput;
    const result = await cartsService.addToCart(userId, input);

    if (result.error) {
      return res.status(result.statusCode).json({ error: result.message });
    }

    return res
      .status(201)
      .json({ message: "Item added to cart" });
  } catch (error) {
    logger.error("Error adding to cart", { error });
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { id: userId } = res.locals.user;
    const { itemId } = req.params;
    const input = req.body as UpdateCartItemInput;
    const result = await cartsService.updateCartItem(userId, itemId as string, input);
    if (result.error) {
      return res.status(result.statusCode).json({ error: result.message });
    }
    return res
      .status(200)
      .json({ message: "Cart item updated", data: result.data });
  } catch (error) {
    logger.error("Error updating cart item", { error });
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const { id: userId } = res.locals.user;
    const { itemId } = req.params;
    const result = await cartsService.removeCartItem(userId, itemId as string);
    if (result.error) {
      return res.status(result.statusCode).json({ error: result.message });
    }
    return res
      .status(200)
      .json({ message: "Item removed from cart", data: result.data });
  } catch (error) {
    logger.error("Error removing cart item", { error });
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const { id: userId } = res.locals.user;
    const result = await cartsService.clearCart(userId);
    if (result.error) {
      return res.status(result.statusCode).json({ error: result.message });
    }
    return res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    logger.error("Error clearing cart", { error });
    return res.status(500).json({ error: "Internal server error" });
  }
};
