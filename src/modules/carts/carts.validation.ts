import { z } from "zod";

export const addToCartSchema = z.object({
  product_id: z.uuid({ message: "Invalid product id" }),
  quantity: z.number({ message: "Quantity must be a number" }).int().min(1, { message: "Quantity must be atleast 1" }).default(1)
});

export const updateCartItemSchema = z.object({
  quantity: z.number({ message: "Quantity must be a number" }).int().min(1, { message: "Quantity must be atleast 1" }).default(1)
})
