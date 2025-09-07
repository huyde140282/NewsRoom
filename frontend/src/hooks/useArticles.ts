import { useCallback } from 'react';
import { api } from '@/lib/api';
import { useAPI } from './useAPI';

export function useArticles(params?: { page?: number; limit?: number; category?: string; categorySlug?: string; search?: string }) {
  const apiFunction = useCallback(async () => {
    const response = await api.getArticles(params);
    return {
      articles: response.data,
      total: response.meta.total,
      page: response.meta.page,
      limit: response.meta.limit
    };
  }, [params?.page, params?.limit, params?.category, params?.categorySlug, params?.search]);

  return useAPI(apiFunction);
}

export function useArticle(slug: string) {
  const apiFunction = useCallback(async () => {
    if (!slug) throw new Error('Slug is required');
    return await api.getArticleBySlug(slug);
  }, [slug]);

  return useAPI(apiFunction, { immediate: !!slug });
}

export function useFeaturedArticles() {
  const apiFunction = useCallback(async () => {
    return await api.getFeaturedArticles();
  }, []);

  const { data: articles, ...rest } = useAPI(apiFunction);
  return { articles: articles || [], ...rest };
}

export function useTrendingArticles() {
  const apiFunction = useCallback(async () => {
    return await api.getTrendingArticles();
  }, []);

  const { data: articles, ...rest } = useAPI(apiFunction);
  return { articles: articles || [], ...rest };
}
