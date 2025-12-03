export interface IBouquet {
  id: string;
  _id?: string; // Для совместимости с MongoDB
  name: string;
  slug?: string;
  description?: string;
  price: number;
  oldPrice?: number;
  images: string[];
  imageUrl?: string; // Для обратной совместимости, будет первое изображение из массива
  categoryIds?: string[];
  categoryId?: string; // Для обратной совместимости
  tags?: string[];
  inStock?: boolean;
  sortOrder?: number;
  isRecommended?: boolean;
  recommendedOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IApiResponse<T> {
  data: T;
  message?: string;
}

export interface IApiError {
  message: string;
  statusCode: number;
}
