import { Router } from "express";
import { authenticate, requireAdmin } from "../../middleware/auth";
import { validate } from "../../middleware/validation";
import {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  reorderCategoriesSchema,
} from "../../validations/categorySchemas";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from "../../controllers/admin/categoryController";

const router = Router();

// Все роуты требуют аутентификации и роль admin
router.use(authenticate, requireAdmin);

router.post("/", validate(createCategorySchema), createCategory);
router.get("/", getCategories);
router.patch("/:id", validate(updateCategorySchema), updateCategory);
router.delete("/:id", validate(deleteCategorySchema), deleteCategory);
router.patch("/reorder", validate(reorderCategoriesSchema), reorderCategories);

export default router;
