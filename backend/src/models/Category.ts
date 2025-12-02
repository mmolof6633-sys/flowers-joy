import mongoose, { Schema, Document } from "mongoose";
import slugify from "slugify";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Название категории обязательно"],
      trim: true,
      maxlength: [100, "Название не должно превышать 100 символов"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Описание не должно превышать 500 символов"],
    },
    image: {
      type: String,
      trim: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Генерация slug перед сохранением
CategorySchema.pre("save", function (this: ICategory, next: () => void) {
  if (this.isModified("name") && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true, locale: "ru" });
  }
  next();
});

// Индексы (slug уже имеет unique: true, который создает индекс)
CategorySchema.index({ isActive: 1, sortOrder: 1 });

export const Category = mongoose.model<ICategory>("Category", CategorySchema);
