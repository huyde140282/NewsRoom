import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Clock, Eye, User } from 'lucide-react';
import { Article } from '@/lib/api';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const readingTime = Math.ceil(article.content.length / 1000); // Rough estimation

  if (variant === 'featured') {
    return (
      <Card className="group overflow-hidden">
        <Link href={`/articles/${article.slug}`}>
          <div className="relative aspect-video overflow-hidden">
            {article.featuredImage ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL}${article.featuredImage}`}
                alt={article.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2 text-xs mb-2">
                <span className="bg-primary px-2 py-1 rounded-full">
                  {article.category.name}
                </span>
              </div>
              <h2 className="text-xl font-bold line-clamp-2 mb-2">
                {article.title}
              </h2>
              {article.excerpt && (
                <p className="text-sm text-gray-200 line-clamp-2">
                  {article.excerpt}
                </p>
              )}
            </div>
          </div>
        </Link>
        <CardFooter className="p-4">
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <User size={12} />
                <span>{article.author.firstName} {article.author.lastName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{readingTime} min read</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={12} />
              <span>{article.viewCount}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className="group overflow-hidden">
        <Link href={`/articles/${article.slug}`}>
          <div className="flex">
            <div className="relative w-24 h-24 flex-shrink-0">
              {article.featuredImage ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${article.featuredImage}`}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">No Image</span>
                </div>
              )}
            </div>
            <CardContent className="flex-1 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <span className="text-primary font-medium">{article.category.name}</span>
                <span>•</span>
                <span>{formatDate(article.publishedAt || article.createdAt)}</span>
              </div>
              <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye size={10} />
                  <span>{article.viewCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={10} />
                  <span>{readingTime}min</span>
                </div>
              </div>
            </CardContent>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden h-full">
      <Link href={`/articles/${article.slug}`}>
        <div className="relative aspect-video overflow-hidden">
          {article.featuredImage ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL}${article.featuredImage}`}
              alt={article.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span className="text-primary font-medium">{article.category.name}</span>
            <span>•</span>
            <span>{formatDate(article.publishedAt || article.createdAt)}</span>
          </div>
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <User size={12} />
              <span>{article.author.firstName} {article.author.lastName}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye size={12} />
                <span>{article.viewCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{readingTime}min</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
