
import Image from "next/image";
import Link from "next/link";
import { formatDate } from '@/lib/utils';
import { getArticles } from '@/lib/server-actions';
import { Article } from '@/lib/api';
import Pagination from '@/components/pagination';

interface CategoryGridProps {
  categorySlug: string;
  categoryName: string;
  page?: number;
}

export default async function CategoryGrid({ categorySlug, categoryName, page = 1 }: CategoryGridProps) {
  const limit = 12;
  
  // Fetch articles from server
  const articlesData = await getArticles({ 
    page, 
    limit, 
    categorySlug 
  });

  const articles = articlesData?.data || [];
  const meta = articlesData?.meta;
  const totalPages = meta?.totalPages || 0;

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No articles found</h3>
        <p className="text-muted-foreground">
          No articles are available in the {categoryName} category.
        </p>
      </div>
    );
  }

  // Split articles into featured and regular
  const featuredArticles = articles.slice(0, 2);
  const regularArticles = articles.slice(2);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{categoryName} Articles</h1>
        <span className="text-gray-500 text-sm">
          {meta?.total || 0} articles found
        </span>
      </div>

      {/* Featured Articles Grid - First 2 articles */}
      {featuredArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {featuredArticles.map((article: Article) => (
            <Link key={article.id} href={`/articles/${article.slug}`} className="group cursor-pointer">
              <div className="relative h-48 mb-3 rounded-lg overflow-hidden">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${article.featuredImage || "/placeholder.svg"}`}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span 
                  className="text-white px-2 py-1 text-xs rounded"
                  style={{ backgroundColor: article.category.color || '#dc2626' }}
                >
                  {article.category.name}
                </span>
                <span className="text-gray-500 text-xs">
                  {formatDate(article.publishedAt || article.createdAt)}
                </span>
              </div>
              <h3 className="font-medium mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="text-gray-600 text-sm line-clamp-3">{article.excerpt}</p>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Ad Space */}
      <div className="bg-gray-800 text-white p-8 text-center rounded mb-8">
        <div className="text-lg font-bold">&lt;html&gt;</div>
        <div className="text-sm">ADS 700x70px</div>
      </div>

      {/* Regular Articles Grid - Remaining articles */}
      {regularArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {regularArticles.map((article: Article) => (
            <Link key={article.id} href={`/articles/${article.slug}`} className="flex gap-3 group cursor-pointer">
              <div className="relative w-24 h-16 md:w-32 md:h-20 flex-shrink-0">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${article.featuredImage || "/placeholder.svg"}`}
                  alt={article.title}
                  fill
                  className="rounded object-cover"
                  sizes="(max-width: 768px) 96px, 128px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span 
                    className="text-white px-2 py-1 text-xs rounded"
                    style={{ backgroundColor: article.category.color || '#dc2626' }}
                  >
                    {article.category.name}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {formatDate(article.publishedAt || article.createdAt)}
                  </span>
                </div>
                <h3 className="text-sm font-medium line-clamp-2 group-hover:text-red-600 transition-colors">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination 
          currentPage={page}
          totalPages={totalPages}
          slug={categorySlug}
        />
      )}
    </div>
  );
}

