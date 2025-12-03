import { Router } from "express";
import { validate } from "../../middleware/validation";
import { getBouquetsQuerySchema } from "../../validations/bouquetSchemas";
import {
  getBouquets,
  getBouquetBySlug,
  getRecommendedBouquets,
} from "../../controllers/public/bouquetController";

const router = Router();

router.get("/recommended", getRecommendedBouquets);
router.get("/", validate(getBouquetsQuerySchema), getBouquets);
router.get("/:slug", getBouquetBySlug);

export default router;
