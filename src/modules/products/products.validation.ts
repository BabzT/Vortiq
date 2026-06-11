import { z } from "zod";

export const getProductsQuerySchema = z.object({
  search: z.string().optional(),
  category_slug: z.string().optional(),
  brand_slug: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(100),
  sort_by: z.enum(["name", "price", "created_at"]).default("created_at"),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
});
