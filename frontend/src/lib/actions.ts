'use server';

import { api, Category } from './api';

export async function getCategoriesAction(): Promise<{ 
  data: Category[]; 
  error?: string 
}> {
  try {
    const categories = await api.getCategories();
    return { data: categories };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { 
      data: [], 
      error: error instanceof Error ? error.message : 'Failed to fetch categories' 
    };
  }
}

export async function getCategoryBySlugAction(slug: string): Promise<{
  data: Category | null;
  error?: string;
}> {
  try {
    const category = await api.getCategoryBySlug(slug);
    return { data: category };
  } catch (error) {
    console.error('Error fetching category:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to fetch category' 
    };
  }
}
