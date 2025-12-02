import { Response, Request } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { CategoryService } from "../../services/categoryService";

export const createCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const category = await CategoryService.create(req.body);
    res.status(201).json({
      success: true,
      data: category,
    });
  }
);

export const getCategories = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const categories = await CategoryService.findAll(true);
    res.json({
      success: true,
      data: categories,
    });
  }
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const category = await CategoryService.update(id, req.body);

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Категория не найдена",
      });
      return;
    }

    res.json({
      success: true,
      data: category,
    });
  }
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const deleted = await CategoryService.delete(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "Категория не найдена",
      });
      return;
    }

    res.json({
      success: true,
      message: "Категория удалена",
    });
  }
);

export const reorderCategories = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { categories } = req.body;
    await CategoryService.reorder(categories);
    res.json({
      success: true,
      message: "Порядок категорий обновлен",
    });
  }
);
