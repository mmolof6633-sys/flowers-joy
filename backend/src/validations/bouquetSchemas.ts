import { z } from "zod";

export const createBouquetSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, "Название обязательно")
      .max(200, "Название слишком длинное"),
    price: z.number().min(0, "Цена не может быть отрицательной"),
    oldPrice: z.number().min(0).optional(),
    images: z
      .array(z.string().url("Некорректный URL изображения"))
      .min(1, "Добавьте хотя бы одно изображение"),
    categoryIds: z
      .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Некорректный ID категории"))
      .min(1, "Выберите хотя бы одну категорию"),
    tags: z.array(z.string()).optional(),
    inStock: z.boolean().optional(),
    sortOrder: z.number().int().min(0).optional(),
    description: z.string().max(1000).optional(),
  }),
});

export const updateBouquetSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Некорректный ID"),
  }),
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    price: z.number().min(0).optional(),
    oldPrice: z.number().min(0).optional(),
    images: z.array(z.string().url()).optional(),
    categoryIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
    tags: z.array(z.string()).optional(),
    inStock: z.boolean().optional(),
    sortOrder: z.number().int().min(0).optional(),
    description: z.string().max(1000).optional(),
  }),
});

export const deleteBouquetSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Некорректный ID"),
  }),
});

export const reorderBouquetsSchema = z.object({
  body: z.object({
    bouquets: z.array(
      z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/),
        sortOrder: z.number().int().min(0),
      })
    ),
  }),
});

export const getBouquetsQuerySchema = z.object({
  query: z.object({
    category: z.string().optional(),
    minPrice: z.string().regex(/^\d+$/).transform(Number).optional(),
    maxPrice: z.string().regex(/^\d+$/).transform(Number).optional(),
    inStock: z
      .string()
      .transform((val) => val === "true")
      .optional(),
    tags: z.string().optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    sort: z
      .enum(["price-asc", "price-desc", "name-asc", "name-desc", "sortOrder"])
      .optional(),
  }),
});
