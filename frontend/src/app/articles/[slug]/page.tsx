'use client';

import { useParams } from 'next/navigation';
import { useArticle } from '@/hooks/useArticles';
import Loading from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error';
import SingleNewsContent from '@/components/screen/article/single-news-content';

export default function ArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const { data: article, loading, error } = useArticle(slug);

  if (loading) {
    return (
      <Loading className="min-h-screen" />
    );
  }

  if (error || !article) {
    return (
      <ErrorMessage 
        message={error || "Article not found"} 
        variant="page" 
      />
    );
  }

  return (
    <SingleNewsContent article={article} />
  );
}
