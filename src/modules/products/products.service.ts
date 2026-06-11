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
    page,
    limit,
    sort_by,
    sort_order,
  } = query;

  const applyFilters = (qb: any) => {
    if (search) {
      qb.where((builder: any) => {
        builder
          .whereILike("p.name", `%${search}%`)
          .orWhereILike("p.sku", `%${search}%`);
      });
    }
    if (category_slug) {
      qb.where("c.slug", category_slug);
    }
    if (brand_slug) {
      qb.where("b.slug", brand_slug);
    }
  };

  const countQuery = db("products as p")
    .count("p.id as total")
    .join("categories as c", "p.category_id", "c.id")
    .join("brands as b", "p.brand_id", "b.id")
    .where("is_active", true)
    .first();
  applyFilters(countQuery);

  const productsQuery = db("products as p")
    .select(
      "p.id",
      "p.name",
      "p.slug",
      "p.description",
      "p.cost",
      "p.price",
      "p.sku",
      "p.stock",
      "p.cover_image",
      "p.other_images",
      "p.is_active",
      "p.created_at",
      "p.updated_at",
      db.raw(
        `jsonb_build_object('id', p.category_id, 'name', c.name, 'slug', c.slug) as category`,
      ),
      db.raw(
        `jsonb_build_object('id', p.brand_id, 'name', b.name, 'slug', b.slug) as brand`,
      ),
    )
    .join("categories as c", "p.category_id", "c.id")
    .join("brands as b", "p.brand_id", "b.id")
    .where("is_active", true)
    .orderBy(sort_by, sort_order)
    .limit(limit)
    .offset((page - 1) * limit);

  applyFilters(productsQuery);

  const [countResult, products] = await Promise.all([
    countQuery,
    productsQuery,
  ]);

  const total = Number(countResult?.total) || 0;

  return {
    error: false,
    data: products,
    pagination: { total, page, limit, total_pages: Math.ceil(total / limit) },
  };
};

export const getProductBySlug = async (
  slug: string,
): Promise<ResponseType<ProductType>> => {
  const product = await db("products as p")
    .join("categories as c", "p.category_id", "c.id")
    .join("brands as b", "p.brand_id", "b.id")
    .select(
      "p.id",
      "p.name",
      "p.slug",
      "p.description",
      "p.cost",
      "p.price",
      "p.sku",
      "p.stock",
      "p.cover_image",
      "p.other_images",
      "p.is_active",
      "p.created_at",
      "p.updated_at",
      db.raw(
        `jsonb_build_object('id', p.category_id, 'name', c.name, 'slug', c.slug) as category`,
      ),
      db.raw(
        `jsonb_build_object('id', p.brand_id, 'name', b.name, 'slug', b.slug) as brand`,
      ),
    )
    .where("p.slug", slug)
    .first();

  if (!product) {
    return {
      error: true,
      message: "Product not found",
      statusCode: 404,
    };
  }

  return { error: false, data: product };
};
