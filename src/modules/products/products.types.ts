export interface ProductType {
  id: string;
  name: string;
  slug: string;
  description: string;
  cost: number;
  price: number;
  stock: number;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  brand_id: string;
  brand_name?: string;
  brand_slug?: string;
  cover_image: object;
  other_images: object[] | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface GetProductsQuery {
  search?: string;
  category_slug?: string;
  brand_slug?: string;
  page: number;
  limit: number;
  sort_by: "name" | "price" | "created_at";
  sort_order: "asc" | "desc";
}
