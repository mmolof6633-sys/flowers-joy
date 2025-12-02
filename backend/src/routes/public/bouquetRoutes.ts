import { Router } from "express";
import { validate } from "../../middleware/validation";
import { getBouquetsQuerySchema } from "../../validations/bouquetSchemas";
import {
  getBouquets,
  getBouquetBySlug,
} from "../../controllers/public/bouquetController";

const router = Router();

router.get("/", validate(getBouquetsQuerySchema), getBouquets);
router.get("/:slug", getBouquetBySlug);

export default router;
