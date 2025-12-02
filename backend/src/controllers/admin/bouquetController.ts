import { Response, Request } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { BouquetService } from "../../services/bouquetService";

export const createBouquet = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const bouquet = await BouquetService.create(req.body);
    const populatedBouquet = await BouquetService.findById(
      bouquet._id.toString()
    );
    res.status(201).json({
      success: true,
      data: populatedBouquet,
    });
  }
);

export const getBouquets = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await BouquetService.findAll({});
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

export const getBouquet = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const bouquet = await BouquetService.findById(id);

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

export const updateBouquet = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const bouquet = await BouquetService.update(id, req.body);

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

export const deleteBouquet = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const deleted = await BouquetService.delete(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "Букет не найден",
      });
      return;
    }

    res.json({
      success: true,
      message: "Букет удален",
    });
  }
);

export const reorderBouquets = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { bouquets } = req.body;
    await BouquetService.reorder(bouquets);
    res.json({
      success: true,
      message: "Порядок букетов обновлен",
    });
  }
);
