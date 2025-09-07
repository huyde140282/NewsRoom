'use server';

import { api, Category, Article, Tag } from './api';

// Server action để fetch categories
export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await api.getCategories();
    return categories; 
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const category = await api.getCategoryBySlug(slug);
    return category;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export async function getTrendingArticles(): Promise<Article[]> {
  try {
    const articles = await api.getTrendingArticles();
    return articles; // Lấy hết trending articles
  } catch (error) {
    console.error('Error fetching trending articles:', error);
    return [];
  }
}

export async function getPopularTags(): Promise<Tag[]> {
  try {
    const articlesResponse = await api.getArticles({ limit: 100 }); 
    const articles = articlesResponse.data;
    
    if (!articles || !Array.isArray(articles)) {
      return [];
    }

    // Extract và count tags
    const tagCountMap = new Map<string, { tag: Tag; count: number }>();
    
    articles.forEach(article => {
      if (article.tags && Array.isArray(article.tags)) {
        article.tags.forEach(tag => {
          if (tag && tag.id) {
            const existing = tagCountMap.get(tag.id);
            if (existing) {
              existing.count++;
            } else {
              tagCountMap.set(tag.id, { tag, count: 1 });
            }
          }
        });
      }
    });

    // Sort by count và return tất cả tags
    const popularTags = Array.from(tagCountMap.values())
      .sort((a, b) => b.count - a.count)
      .map(item => item.tag);

    return popularTags;
  } catch (error) {
    console.error('Error fetching popular tags:', error);
    // Fallback static tags nếu có lỗi
    return [
      { id: 'static-1', name: 'Politics', slug: 'politics', createdAt: '', color: '#ef4444' },
      { id: 'static-2', name: 'Business', slug: 'business', createdAt: '', color: '#3b82f6' },
      { id: 'static-3', name: 'Technology', slug: 'technology', createdAt: '', color: '#10b981' },
      { id: 'static-4', name: 'Sports', slug: 'sports', createdAt: '', color: '#f59e0b' },
      { id: 'static-5', name: 'Health', slug: 'health', createdAt: '', color: '#8b5cf6' },
      { id: 'static-6', name: 'Entertainment', slug: 'entertainment', createdAt: '', color: '#ec4899' },
    ];
  }
}

export async function getArticles(params?: { page?: number; limit?: number; category?: string; categorySlug?: string; search?: string }) {
  try {
    const result = await api.getArticles(params);
    console.log('Fetched articles:', result);
    return result;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return {
      data: [],
      meta: {
        total: 0,
        count: 0,
        page: 1,
        limit: 12,
        totalPages: 0,
      },
    };
  }
}

export async function getFeaturedArticles() {
  try {
    const result = await api.getFeaturedArticles();
    return result;
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    return {
      data: [],
      meta: {
        total: 0,
        count: 0,
        page: 1,
        limit: 12,
        totalPages: 0,
      },
    };
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const article = await api.getArticleBySlug(slug);
    return article;
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return null;
  }
}
