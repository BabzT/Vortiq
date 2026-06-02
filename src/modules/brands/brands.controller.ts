import { Request, Response } from "express";
import * as brandsService from "./brands.service";

export const getBrands = async (req: Request, res: Response) => {
  try {
    const result = await brandsService.getBrands();

    if (!result.error) {
      return res.status(200).json({
        message: "Brands fetched successfully",
        data: result.data,
      });
    }
  } catch (error) {
    console.error("Error fetching brands:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
