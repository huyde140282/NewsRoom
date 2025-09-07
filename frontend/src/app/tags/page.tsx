'use client';

import { useSearchParams } from 'next/navigation';
import { useArticles } from '@/hooks/useArticles';
import { useTrendingArticles } from '@/hooks/useArticles';
import { usePopularTags } from '@/hooks/useExtractedData';
import ArticleCard from '@/components/screen/article/article-card';
import Loading from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error';
import { Tag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';

export default function TagsPage() {
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get('tag') || '';
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  
  // Prevent SSR mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Get all articles and trending for tags
  const { articles: trendingArticles } = useTrendingArticles();
  const popularTags = mounted ? usePopularTags(trendingArticles, 50) : []; // Get more tags
  
  // Reset page when tag changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTag]);

  // Get articles for selected tag (use search if tag is selected)
  const queryParams = useMemo(() => {
    const params: any = {
      page: currentPage,
      limit: 12,
    };
    
    if (selectedTag) {
      params.search = selectedTag;
    }
    
    return params;
  }, [currentPage, selectedTag]);

  const { 
    data: articlesData, 
    loading, 
    error, 
    refetch 
  } = useArticles(queryParams);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Loading className="min-h-screen" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <ErrorMessage message={error} onRetry={refetch} variant="page" />
      </div>
    );
  }

  const articles = articlesData?.articles || [];
  const totalPages = Math.ceil((articlesData?.total || 0) / (articlesData?.limit || 12));
  const totalResults = articlesData?.total || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
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
          
          <h1 className="text-4xl font-bold mb-4">
            {selectedTag ? `Articles tagged with "${selectedTag}"` : 'All Tags'}
          </h1>
          
          {selectedTag && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                {totalResults} {totalResults === 1 ? 'article' : 'articles'} found
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedTag ? (
              // Show articles for selected tag
              articles.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {articles.map((article) => (
                      <ArticleCard 
                        key={`article-${article.id}`} 
                        article={article} 
                      />
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
                  <Tag className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                  <p className="text-muted-foreground mb-4">
                    No articles found for tag "<strong>{selectedTag}</strong>"
                  </p>
                  <Button asChild>
                    <Link href="/tags">Browse All Tags</Link>
                  </Button>
                </div>
              )
            ) : (
              // Show message to select a tag
              <div className="text-center py-12">
                <Tag className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-2">Select a tag to view articles</h3>
                <p className="text-muted-foreground">
                  Choose a tag from the sidebar to see related articles
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - Tags */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
              <h3 className="text-lg font-bold mb-4">Popular Tags</h3>
              <div className="space-y-2">
                {mounted && popularTags.map((tag, index) => (
                  <Link
                    key={`tag-${tag.id || index}`}
                    href={`/tags?tag=${encodeURIComponent(tag.name)}`}
                    className={`block px-3 py-2 rounded text-sm transition-colors ${
                      selectedTag === tag.name
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-red-600 hover:text-white'
                    }`}
                  >
                    #{tag.name}
                  </Link>
                ))}
                {!mounted && (
                  <div className="text-center text-gray-500 py-4">Loading tags...</div>
                )}
              </div>
              
              {selectedTag && (
                <div className="mt-6 pt-6 border-t">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/tags">
                      Clear Filter
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
