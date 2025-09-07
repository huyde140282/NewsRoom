import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ArticleCard from '@/components/screen/article/article-card';
import Breadcrumb from '@/components/ui/breadcrumb';
import Pagination from '@/components/pagination';
import { getArticles } from '@/lib/server-actions';

export const metadata: Metadata = {
  title: 'All Articles - NewsRoom',
  description: 'Browse all articles in NewsRoom. Discover the latest news and stories.',
  keywords: 'articles, news, stories, latest, newsroom',
};

interface ArticlesPageProps {
  searchParams: {
    page?: string;
    search?: string;
    category?: string;
  };
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search;
  const categorySlug = searchParams.category;

  // Fetch articles với params từ URL
  const articlesData = await getArticles({
    page,
    limit: 1,
    ...(search && { search }),
    ...(categorySlug && { categorySlug }),
  });

  const articles = articlesData.data || [];
  const meta = articlesData.meta;
  const totalPages = meta.totalPages || 0;

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Articles', active: true }]} />
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
        <h1 className="text-4xl font-bold mb-4">All Articles</h1>
        <p className="text-muted-foreground">
          Discover all our latest news and articles
        </p>
        
        {/* Search/Filter Info */}
        {(search || categorySlug) && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              {search && categorySlug && (
                <>Showing results for "<strong>{search}</strong>" in <strong>{categorySlug}</strong> ({meta.total} articles)</>
              )}
              {search && !categorySlug && (
                <>Showing results for "<strong>{search}</strong>" ({meta.total} articles)</>
              )}
              {!search && categorySlug && (
                <>Showing articles in <strong>{categorySlug}</strong> ({meta.total} articles)</>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              slug='articles'
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📰</div>
          {search ? (
            <>
              <h3 className="text-xl font-semibold mb-2">No articles found for "{search}"</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search term or browse all articles
              </p>
              <Button variant="outline" asChild>
                <Link href="/articles">View All Articles</Link>
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                Check back later for new content
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}
