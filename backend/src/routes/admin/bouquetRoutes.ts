import { Router } from "express";
import { authenticate, requireAdmin } from "../../middleware/auth";
import { validate } from "../../middleware/validation";
import {
  createBouquetSchema,
  updateBouquetSchema,
  deleteBouquetSchema,
  reorderBouquetsSchema,
} from "../../validations/bouquetSchemas";
import {
  createBouquet,
  getBouquets,
  getBouquet,
  updateBouquet,
  deleteBouquet,
  reorderBouquets,
} from "../../controllers/admin/bouquetController";

const router = Router();

// Все роуты требуют аутентификации и роль admin
router.use(authenticate, requireAdmin);

router.post("/", validate(createBouquetSchema), createBouquet);
router.get("/", getBouquets);
router.get("/:id", getBouquet);
router.patch("/:id", validate(updateBouquetSchema), updateBouquet);
router.delete("/:id", validate(deleteBouquetSchema), deleteBouquet);
router.patch("/reorder", validate(reorderBouquetsSchema), reorderBouquets);

export default router;
