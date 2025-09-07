import { api, Article } from '@/lib/api';

interface SimpleTag {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

/**
 * Extract popular tags from articles
 */
export async function extractPopularTags(limit = 12): Promise<SimpleTag[]> {
  try {
    // Fetch articles to extract tags from
    const articlesData = await api.getArticles({ page: 1, limit: 50 });
    const articles = articlesData.data || [];

    const tagsMap = new Map<string, { tag: SimpleTag; count: number }>();

    // Extract and count tags from articles
    articles.forEach((article: Article) => {
      if (article?.tags && Array.isArray(article.tags)) {
        article.tags.forEach((tag) => {
          if (tag?.id && tag?.name) {
            const tagKey = String(tag.id);
            const simpleTag: SimpleTag = {
              id: String(tag.id),
              name: String(tag.name),
              slug: String(tag.slug || tag.name.toLowerCase().replace(/\s+/g, '-')),
              color: tag.color ? String(tag.color) : undefined,
            };

            if (tagsMap.has(tagKey)) {
              tagsMap.get(tagKey)!.count += 1;
            } else {
              tagsMap.set(tagKey, { tag: simpleTag, count: 1 });
            }
          }
        });
      }
    });

    // Sort by count (most popular first) and return limited results
    const sortedTags = Array.from(tagsMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map(item => item.tag);

    // Fallback to some default tags if no tags found
    if (sortedTags.length === 0) {
      return [
        { id: 'fallback-1', name: 'Technology', slug: 'technology' },
        { id: 'fallback-2', name: 'Business', slug: 'business' },
        { id: 'fallback-3', name: 'Sports', slug: 'sports' },
        { id: 'fallback-4', name: 'Health', slug: 'health' },
        { id: 'fallback-5', name: 'Entertainment', slug: 'entertainment' },
        { id: 'fallback-6', name: 'Politics', slug: 'politics' },
      ];
    }

    return sortedTags;
  } catch (error) {
    console.error('Error extracting popular tags:', error);
    // Return fallback tags on error
    return [
      { id: 'fallback-1', name: 'Technology', slug: 'technology' },
      { id: 'fallback-2', name: 'Business', slug: 'business' },
      { id: 'fallback-3', name: 'Sports', slug: 'sports' },
      { id: 'fallback-4', name: 'Health', slug: 'health' },
      { id: 'fallback-5', name: 'Entertainment', slug: 'entertainment' },
      { id: 'fallback-6', name: 'Politics', slug: 'politics' },
    ];
  }
}

export async function getSidebarData() {
  try {
    const [categories, trendingArticles, popularTags] = await Promise.all([
      api.getCategories(),
      api.getTrendingArticles(),
      extractPopularTags(12),
    ]);

    return {
      categories: categories.slice(0, 4),
      trendingArticles: trendingArticles.slice(0, 5),
      popularTags,
    };
  } catch (error) {
    console.error('Error fetching sidebar data:', error);
    return {
      categories: [],
      trendingArticles: [],
      popularTags: [],
    };
  }
}
