import { Bouquet, IBouquet } from "../models/Bouquet";
import mongoose from "mongoose";

export interface BouquetFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  tags?: string[];
  page?: number;
  limit?: number;
  sort?: string;
}

export class BouquetService {
  static async create(data: {
    name: string;
    price: number;
    oldPrice?: number;
    images: string[];
    categoryIds: string[];
    tags?: string[];
    inStock?: boolean;
    sortOrder?: number;
    description?: string;
  }): Promise<IBouquet> {
    const bouquet = new Bouquet({
      ...data,
      categoryIds: data.categoryIds.map(
        (id) => new mongoose.Types.ObjectId(id)
      ),
    });
    return await bouquet.save();
  }

  static async findAll(filters: BouquetFilters = {}): Promise<{
    bouquets: IBouquet[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      category,
      minPrice,
      maxPrice,
      inStock,
      tags,
      page = 1,
      limit = 20,
      sort = "sortOrder",
    } = filters;

    const query: any = {};

    // Фильтр по категории (slug)
    if (category) {
      const categoryDoc = await mongoose
        .model("Category")
        .findOne({ slug: category, isActive: true });
      if (categoryDoc) {
        query.categoryIds = categoryDoc._id;
      } else {
        // Если категория не найдена, возвращаем пустой результат
        return {
          bouquets: [],
          total: 0,
          page,
          limit,
          totalPages: 0,
        };
      }
    }

    // Фильтр по цене
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    // Фильтр по наличию
    if (inStock !== undefined) {
      query.inStock = inStock;
    }

    // Фильтр по тегам
    if (tags && tags.length > 0) {
      query.tags = { $in: tags };
    }

    // Сортировка
    let sortOption: any = {};
    switch (sort) {
      case "price-asc":
        sortOption = { price: 1 };
        break;
      case "price-desc":
        sortOption = { price: -1 };
        break;
      case "name-asc":
        sortOption = { name: 1 };
        break;
      case "name-desc":
        sortOption = { name: -1 };
        break;
      default:
        sortOption = { sortOrder: 1, createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    const [bouquets, total] = await Promise.all([
      Bouquet.find(query)
        .populate("categoryIds", "name slug image")
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Bouquet.countDocuments(query),
    ]);

    return {
      bouquets,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async findById(id: string): Promise<IBouquet | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return await Bouquet.findById(id).populate(
      "categoryIds",
      "name slug image"
    );
  }

  static async findBySlug(slug: string): Promise<IBouquet | null> {
    return await Bouquet.findOne({ slug }).populate(
      "categoryIds",
      "name slug image"
    );
  }

  static async update(
    id: string,
    data: Partial<IBouquet> & { categoryIds?: string[] }
  ): Promise<IBouquet | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const updateData: any = { ...data };
    if (data.categoryIds) {
      updateData.categoryIds = data.categoryIds.map(
        (id) => new mongoose.Types.ObjectId(id)
      );
    }

    return await Bouquet.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("categoryIds", "name slug image");
  }

  static async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await Bouquet.findByIdAndDelete(id);
    return !!result;
  }

  static async reorder(
    bouquets: Array<{ id: string; sortOrder: number }>
  ): Promise<void> {
    const bulkOps = bouquets.map(({ id, sortOrder }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { sortOrder } },
      },
    }));

    await Bouquet.bulkWrite(bulkOps);
  }

  static async getRecommended(limit: number = 8): Promise<IBouquet[]> {
    return await Bouquet.find({
      isRecommended: true,
      inStock: true,
    })
      .populate("categoryIds", "name slug image")
      .sort({ recommendedOrder: 1, sortOrder: 1, createdAt: -1 })
      .limit(limit);
  }
}
