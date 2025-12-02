import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, "Название обязательно")
      .max(100, "Название слишком длинное"),
    description: z.string().max(500, "Описание слишком длинное").optional(),
    image: z.string().url("Некорректный URL изображения").optional(),
    sortOrder: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Некорректный ID"),
  }),
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    image: z.string().url().optional(),
    sortOrder: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const deleteCategorySchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Некорректный ID"),
  }),
});

export const reorderCategoriesSchema = z.object({
  body: z.object({
    categories: z.array(
      z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/),
        sortOrder: z.number().int().min(0),
      })
    ),
  }),
});
