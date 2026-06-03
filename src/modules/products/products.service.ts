import db from "@/db";
import { ProductType, GetProductsQuery } from "./products.types";
import { ResponseType, ResponseTypeWithPagination } from "@/types/response";
import { error } from "node:console";

export const getProducts = async (
  query: GetProductsQuery,
): Promise<ResponseTypeWithPagination<ProductType[]>> => {
  const {
    search,
    category_slug,
    brand_slug,
    is_active,
    page,
    limit,
    sort_by,
    sort_order,
  } = query;

  const applyFilters = (qb: any) => {
    if (search) {
      qb.where((builder: any) => {
        builder
          .whereILike("products.name", `%${search}%`)
          .orWhereILike("products.sku", `%${search}%`);
      });
    }
    if (category_slug) {
      qb.where("categories.slug", category_slug);
    }
    if (brand_slug) {
      qb.where("brands.slug", brand_slug);
    }
    if (is_active !== undefined) {
      qb.where("is_active", is_active);
    }
  };

  const countQuery = db("products as p")
    .count("p.id as total")
    .join("categories as c", "p.category_id", "c.id")
    .join("brands as b", "p.brand_id", "b.id")
    .first();
  applyFilters(countQuery);

  const productsQuery = db("products as p")
    .select(
      "p.*",
      "c.name as category_name",
      "c.slug as category_slug",
      "b.name as brand_name",
      "b.slug as brand_slug",
    )
    .join("categories as c", "p.category_id", "c.id")
    .join("brands as b", "p.brand_id", "b.id")
    .orderBy(sort_by, sort_order)
    .limit(limit)
    .offset((page - 1) * limit);

  applyFilters(productsQuery);

  const [countResult, products] = await Promise.all([
    countQuery,
    productsQuery,
  ]);

  const items = products.map(
    ({
      category_id,
      category_name,
      category_slug,
      brand_id,
      brand_name,
      brand_slug,
      ...rest
    }) => ({
      ...rest,
      category: { id: category_id, name: category_name, slug: category_slug },
      brand: { id: brand_id, name: brand_name, slug: brand_slug },
    }),
  );

  const total = Number(countResult?.total) || 0;

  return {
    error: false,
    data: items,
    pagination: { total, page, limit, total_pages: Math.ceil(total / limit) },
  };
};

export const getProductBySlug = async (
  slug: string,
): Promise<ResponseType<ProductType>> => {
  const result = await db("products as p")
    .join("categories as c", "p.category_id", "c.id")
    .join("brands as b", "p.brand_id", "b.id")
    .select(
      "p.*",
      "c.name as category_name",
      "c.slug as category_slug",
      "b.name as brand_name",
      "b.slug as brand_slug",
    )
    .where("p.slug", slug)
    .first();

  if (!result) {
    return {
      error: true,
      message: "Product not found",
      statusCode: 404,
    };
  }

  const {
    category_id,
    category_name,
    category_slug,
    brand_id,
    brand_name,
    brand_slug,
    ...rest
  } = result;

  const product = {
    ...rest,
    category: { id: category_id, name: category_name, slug: category_slug },
    brand: { id: brand_id, name: brand_name, slug: brand_slug },
  };

  return { error: false, data: product };
};
