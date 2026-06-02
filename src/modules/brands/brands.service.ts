import db from "@/db";
import { ResponseType } from "@/types/response";
import { BrandType } from "./brands.types";

export const getBrands = async (): Promise<ResponseType<BrandType[]>> => {
  const brands = await db("brands").select("*");
  return { error: false, data: brands };
};
