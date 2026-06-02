import { Request, Response } from "express";
import * as categoriesService from "./categories.service";

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const result = await categoriesService.getAllCategories();
    if (!result.error) {
      return res.status(200).json({
        message: "Categories fetched successfully",
        data: result.data,
      });
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
