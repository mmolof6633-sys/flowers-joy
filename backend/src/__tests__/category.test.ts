import { CategoryService } from "../services/categoryService";
import { Category } from "../models/Category";
import mongoose from "mongoose";

// Моки для тестов
jest.mock("../models/Category");

describe("CategoryService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("должен создать категорию", async () => {
      const categoryData = {
        name: "Тестовая категория",
        description: "Описание",
        isActive: true,
      };

      const mockCategory = {
        _id: new mongoose.Types.ObjectId(),
        ...categoryData,
        save: jest.fn().mockResolvedValue(true),
      };

      (Category as any).mockImplementation(() => mockCategory);

      const result = await CategoryService.create(categoryData);

      expect(Category).toHaveBeenCalledWith(categoryData);
      expect(mockCategory.save).toHaveBeenCalled();
    });
  });

  describe("findAll", () => {
    it("должен вернуть все активные категории", async () => {
      const mockCategories = [
        { _id: "1", name: "Категория 1", isActive: true },
        { _id: "2", name: "Категория 2", isActive: true },
      ];

      (Category.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockCategories),
      });

      const result = await CategoryService.findAll(false);

      expect(Category.find).toHaveBeenCalledWith({ isActive: true });
      expect(result).toEqual(mockCategories);
    });
  });
});
