import { Router } from "express";
import authRoutes from "@/modules/auth/auth.routes";
import categoriesRoutes from "@/modules/categories/categories.routes";
import brandsRoutes from "@/modules/brands/brands.routes";
import uploadRoutes from "@/modules/upload/upload.routes";
import productsRoutes from "@/modules/products/products.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoriesRoutes);
router.use("/brands", brandsRoutes);
router.use("/upload", uploadRoutes);
router.use("/products", productsRoutes);

export default router;
