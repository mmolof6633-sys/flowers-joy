const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Получить базовый URL для серверных запросов
function getApiUrl(): string {
  // На сервере используем внутренний URL или переменную окружения
  if (typeof window === 'undefined') {
    // В production можно использовать внутренний URL сервиса
    return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  }
  // На клиенте используем публичный URL
  return API_URL;
}

export const apiClient = {
  get: async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const baseUrl = getApiUrl();
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      // Для сервера используем revalidate вместо no-store для лучшей производительности
      ...(typeof window === 'undefined'
        ? { next: { revalidate: 60 } } // Revalidate каждые 60 секунд на сервере
        : {}),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  },
  post: async <T>(endpoint: string, data?: unknown): Promise<T> => {
    const baseUrl = getApiUrl();
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  },
};
