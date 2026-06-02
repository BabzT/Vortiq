import express from "express";
import * as categoriesController from "@/modules/categories/categories.controllers";

const router = express.Router();

router.get("/", categoriesController.getAllCategories);

export default router;
