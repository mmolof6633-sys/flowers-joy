export interface IBouquet {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
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
