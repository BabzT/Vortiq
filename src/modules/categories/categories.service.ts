import db from "@/db";
import { CategoryType } from "./categories.types";
import { ResponseType } from "@/types/response";

export const getAllCategories = async (): Promise<
  ResponseType<CategoryType[]>
> => {
  const categories = await db("categories").select("*");
  return { error: false, data: categories };
};
