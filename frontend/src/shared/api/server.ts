// Серверные функции для загрузки данных на сервере (SSR)
import { apiClient } from './client';
import { IApiResponse } from './types';
import { IBouquet } from '@entities/bouquet';
import { ICategory } from '@entities/category';

interface GetBouquetsParams {
  category?: string; // slug категории
  categoryId?: string; // ID категории (для обратной совместимости)
}

/**
 * Загружает список букетов на сервере
 */
export async function getBouquets(params?: GetBouquetsParams): Promise<IApiResponse<IBouquet[]>> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.category) {
      queryParams.append('category', params.category);
    } else if (params?.categoryId) {
      // Если передан ID, нужно сначала найти slug категории
      // Но лучше передавать slug напрямую
      queryParams.append('category', params.categoryId);
    }
    const queryString = queryParams.toString();
    const endpoint = `/bouquets${queryString ? `?${queryString}` : ''}`;
    const response = await apiClient.get<{
      success: boolean;
      data: IBouquet[];
      pagination?: unknown;
    }>(endpoint);

    // Адаптируем ответ бэкенда к формату IApiResponse
    return {
      data: response.data || [],
    };
  } catch (error) {
    console.error('Failed to fetch bouquets:', error);
    return {
      data: [],
      message: 'Не удалось загрузить букеты',
    };
  }
}

/**
 * Загружает букет по ID на сервере
 * ВАЖНО: API использует slug, а не ID. Если передан ID, попробуем использовать его как slug
 */
export async function getBouquetById(id: string): Promise<IApiResponse<IBouquet> | null> {
  try {
    const response = await apiClient.get<{ success: boolean; data: IBouquet }>(`/bouquets/${id}`);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch bouquet:', error);
    return null;
  }
}

/**
 * Загружает букет по slug на сервере
 */
export async function getBouquetBySlug(slug: string): Promise<IApiResponse<IBouquet> | null> {
  try {
    const response = await apiClient.get<{ success: boolean; data: IBouquet }>(`/bouquets/${slug}`);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch bouquet by slug:', error);
    return null;
  }
}

/**
 * Загружает список категорий на сервере
 */
export async function getCategories(): Promise<IApiResponse<ICategory[]>> {
  try {
    const response = await apiClient.get<{ success: boolean; data: ICategory[] }>('/categories');
    // Адаптируем ответ бэкенда к формату IApiResponse
    return {
      data: response.data || [],
    };
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return {
      data: [],
      message: 'Не удалось загрузить категории',
    };
  }
}

/**
 * Загружает категорию по slug на сервере
 */
export async function getCategoryBySlug(
  slug: string
): Promise<IApiResponse<ICategory & { bouquets?: IBouquet[] }> | null> {
  try {
    const response = await apiClient.get<{
      success: boolean;
      data: ICategory & { bouquets?: IBouquet[] };
    }>(`/categories/${slug}`);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch category by slug:', error);
    return null;
  }
}
