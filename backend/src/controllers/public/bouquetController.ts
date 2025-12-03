import { Response, Request } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { BouquetService } from "../../services/bouquetService";

export const getBouquets = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { category, minPrice, maxPrice, inStock, tags, page, limit, sort } =
      req.query;

    const filters: any = {};
    if (category) filters.category = category as string;
    if (minPrice) filters.minPrice = Number(minPrice);
    if (maxPrice) filters.maxPrice = Number(maxPrice);
    if (inStock !== undefined) filters.inStock = inStock === "true";
    if (tags) filters.tags = (tags as string).split(",");
    if (page) filters.page = Number(page);
    if (limit) filters.limit = Number(limit);
    if (sort) filters.sort = sort as string;

    const result = await BouquetService.findAll(filters);

    res.json({
      success: true,
      data: result.bouquets,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  }
);

export const getBouquetBySlug = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    const bouquet = await BouquetService.findBySlug(slug);

    if (!bouquet) {
      res.status(404).json({
        success: false,
        message: "Букет не найден",
      });
      return;
    }

    res.json({
      success: true,
      data: bouquet,
    });
  }
);

export const getRecommendedBouquets = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const limit = req.query.limit ? Number(req.query.limit) : 8;
    const bouquets = await BouquetService.getRecommended(limit);

    res.json({
      success: true,
      data: bouquets,
    });
  }
);
