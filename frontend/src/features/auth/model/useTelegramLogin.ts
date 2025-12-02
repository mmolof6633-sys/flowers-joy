import { useState, useCallback } from 'react';

export function useTelegramLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const login = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Telegram login logic will be implemented here
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Login failed'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    login,
    isLoading,
    error,
  };
}
