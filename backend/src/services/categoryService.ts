import { Category, ICategory } from "../models/Category";
import mongoose from "mongoose";

export class CategoryService {
  static async create(data: {
    name: string;
    description?: string;
    image?: string;
    sortOrder?: number;
    isActive?: boolean;
  }): Promise<ICategory> {
    const category = new Category(data);
    return await category.save();
  }

  static async findAll(includeInactive = false): Promise<ICategory[]> {
    const query = includeInactive ? {} : { isActive: true };
    return await Category.find(query).sort({ sortOrder: 1, createdAt: -1 });
  }

  static async findById(id: string): Promise<ICategory | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return await Category.findById(id);
  }

  static async findBySlug(slug: string): Promise<ICategory | null> {
    return await Category.findOne({ slug, isActive: true });
  }

  static async update(
    id: string,
    data: Partial<ICategory>
  ): Promise<ICategory | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  static async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await Category.findByIdAndDelete(id);
    return !!result;
  }

  static async reorder(
    categories: Array<{ id: string; sortOrder: number }>
  ): Promise<void> {
    const bulkOps = categories.map(({ id, sortOrder }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { sortOrder } },
      },
    }));

    await Category.bulkWrite(bulkOps);
  }
}
