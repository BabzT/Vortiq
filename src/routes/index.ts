import { Router } from "express";
import authRoutes from "@/modules/auth/auth.routes";
import categoriesRoutes from "@/modules/categories/categories.routes";
import brandsRoutes from "@/modules/brands/brands.routes";
import uploadRoutes from "@/modules/upload/upload.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoriesRoutes);
router.use("/brands", brandsRoutes);
router.use("/upload", uploadRoutes);

export default router;
