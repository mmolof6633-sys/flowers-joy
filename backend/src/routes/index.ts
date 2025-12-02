import { Router } from "express";
import authRoutes from "./authRoutes";
import adminCategoryRoutes from "./admin/categoryRoutes";
import adminBouquetRoutes from "./admin/bouquetRoutes";
import publicCategoryRoutes from "./public/categoryRoutes";
import publicBouquetRoutes from "./public/bouquetRoutes";

const router = Router();

// Public routes
router.use("/auth", authRoutes);
router.use("/categories", publicCategoryRoutes);
router.use("/bouquets", publicBouquetRoutes);

// Admin routes
router.use("/admin/categories", adminCategoryRoutes);
router.use("/admin/bouquets", adminBouquetRoutes);

export default router;
