const API_BASE_URL = typeof window === 'undefined' 
  ? process.env.API_URL || 'http://localhost:3001/api/v1'  // Server-side
  : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'; // Client-side

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(response.status, `API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Articles
  getArticles: (
    params?: { page?: number; limit?: number; category?: string; categorySlug?: string; search?: string },
  ) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.category) searchParams.set('category', params.category);
    if (params?.categorySlug) searchParams.set('categorySlug', params.categorySlug);
    if (params?.search) searchParams.set('search', params.search);
    
    const query = searchParams.toString();
    console.log('Fetching articles with query:', query);
    return apiRequest<{
      data: Article[];
      meta: {
        total: number;
        count: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(`/articles${query ? `?${query}` : ''}`, {
      // Cache options for server-side rendering
      cache:  'force-cache' ,
    });
  },

  getArticleBySlug: (slug: string) => 
    apiRequest<{ data: Article }>(`/articles/${slug}`).then(response => response.data),

  getFeaturedArticles: () => 
    apiRequest<{ data: Article[] }>('/articles/featured').then(response => response.data),

  getTrendingArticles: () => 
    apiRequest<{ data: Article[] }>('/articles/trending').then(response => response.data),

  // Categories
  getCategories: () => 
    apiRequest<{ data: Category[] }>('/categories').then(response => response.data),

  getCategoryBySlug: (slug: string) => 
    apiRequest<{ data: Category }>(`/categories/${slug}`).then(response => response.data),
    
  // Comments
  getComments: (articleSlug: string) => 
    apiRequest<{ data: CommentResponse[] }>(`/articles/${articleSlug}/comments`).then(response => response.data),

  createComment: (articleSlug: string, data: { authorName: string; authorEmail: string; content: string; website?: string }) => 
    apiRequest<{ data: CommentResponse }>(`/articles/${articleSlug}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    }).then(response => response.data),
};

// Types from backend
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: 'admin' | 'user';
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  articleCount?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  createdAt: string;
  articleCount?: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  status: 'draft' | 'published' | 'archived';
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  category: Category;
  tags: Tag[];
}

export interface Comment {
  id: string;
  content: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  author: User;
  article: Article;
  replies?: Comment[];
}

export interface CommentResponse {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
  avatarUrl?: string;
  website?: string;
}
