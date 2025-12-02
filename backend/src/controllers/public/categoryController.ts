import { Response, Request } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { CategoryService } from "../../services/categoryService";
import { BouquetService } from "../../services/bouquetService";

export const getCategories = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const categories = await CategoryService.findAll(false);
    res.json({
      success: true,
      data: categories,
    });
  }
);

export const getCategoryBySlug = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    const category = await CategoryService.findBySlug(slug);

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Категория не найдена",
      });
      return;
    }

    // Получаем букеты этой категории
    const result = await BouquetService.findAll({
      category: slug,
      limit: 100,
    });

    res.json({
      success: true,
      data: {
        ...category.toObject(),
        bouquets: result.bouquets,
      },
    });
  }
);
