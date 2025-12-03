import mongoose, { Schema, Document } from "mongoose";
import slugify from "slugify";

export interface IBouquet extends Document {
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  images: string[];
  categoryIds: mongoose.Types.ObjectId[];
  tags: string[];
  inStock: boolean;
  sortOrder: number;
  isRecommended: boolean;
  recommendedOrder: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BouquetSchema = new Schema<IBouquet>(
  {
    name: {
      type: String,
      required: [true, "Название букета обязательно"],
      trim: true,
      maxlength: [200, "Название не должно превышать 200 символов"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true,
    },
    price: {
      type: Number,
      required: [true, "Цена обязательна"],
      min: [0, "Цена не может быть отрицательной"],
    },
    oldPrice: {
      type: Number,
      min: [0, "Старая цена не может быть отрицательной"],
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (images: string[]) => images.length > 0,
        message: "Добавьте хотя бы одно изображение",
      },
    },
    categoryIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    tags: {
      type: [String],
      default: [],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isRecommended: {
      type: Boolean,
      default: false,
    },
    recommendedOrder: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Описание не должно превышать 1000 символов"],
    },
  },
  {
    timestamps: true,
  }
);

// Генерация slug перед сохранением
BouquetSchema.pre("save", function (this: IBouquet, next: () => void) {
  if (this.isModified("name") && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true, locale: "ru" });
  }
  next();
});

// Индексы (slug уже имеет unique: true, который создает индекс)
BouquetSchema.index({ categoryIds: 1 });
BouquetSchema.index({ inStock: 1, sortOrder: 1 });
BouquetSchema.index({ price: 1 });
BouquetSchema.index({ isRecommended: 1, recommendedOrder: 1 });

export const Bouquet = mongoose.model<IBouquet>("Bouquet", BouquetSchema);
