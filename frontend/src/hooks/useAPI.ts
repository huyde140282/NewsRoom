import { useState, useEffect, useCallback } from 'react';

interface UseAPIOptions {
  immediate?: boolean; // Có fetch ngay khi mount hay không
}

interface UseAPIResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  execute: () => Promise<void>;
}

export function useAPI<T>(
  apiFunction: () => Promise<T>,
  options: UseAPIOptions = { immediate: true }
): UseAPIResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      console.error('API Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const refetch = useCallback(() => {
    execute();
  }, [execute]);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);

  return {
    data,
    loading,
    error,
    refetch,
    execute
  };
}
