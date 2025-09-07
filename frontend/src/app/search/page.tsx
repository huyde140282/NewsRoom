'use client';

import { useSearchParams } from 'next/navigation';
import { useArticles } from '@/hooks/useArticles';
import ArticleCard from '@/components/screen/article/article-card';
import Loading from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error';
import { Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page khi search query thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: 12,
    ...(query && { search: query }),
  }), [currentPage, query]);

  const { 
    data: articlesData, 
    loading, 
    error, 
    refetch 
  } = useArticles(queryParams);

  if (loading) {
    return <Loading className="min-h-screen" />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} variant="page" />;
  }

  const articles = articlesData?.articles || [];
  const totalPages = Math.ceil((articlesData?.total || 0) / (articlesData?.limit || 12));
  const totalResults = articlesData?.total || 0;

  return (
    <>
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
        
        <h1 className="text-4xl font-bold mb-4">Search Results</h1>
        
        {query && (
          <div className="mb-4">
            <p className="text-lg text-muted-foreground">
              Results for "<strong>{query}</strong>"
            </p>
            <p className="text-sm text-muted-foreground">
              {totalResults} {totalResults === 1 ? 'article' : 'articles'} found
            </p>
          </div>
        )}
      </div>

      {/* Results */}
      {!query ? (
        <div className="text-center py-12">
          <Search className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold mb-2">Enter a search term</h3>
          <p className="text-muted-foreground">
            Use the search box in the header to find articles
          </p>
        </div>
      ) : articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <Search className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold mb-2">No articles found</h3>
          <p className="text-muted-foreground mb-4">
            No articles match your search for "<strong>{query}</strong>"
          </p>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Try:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Checking your spelling</li>
              <li>• Using different keywords</li>
              <li>• Using more general terms</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
