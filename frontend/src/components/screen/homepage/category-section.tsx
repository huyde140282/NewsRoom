import Image from "next/image"
import Link from "next/link"
import { getArticles } from "@/lib/server-actions"
import { formatDate } from "@/lib/utils"

interface CategorySectionProps {
  title: string
  categorySlug?: string
  categoryId?: string
}

export default async function CategorySection({ title, categorySlug }: CategorySectionProps) {
  const articlesData = await getArticles({ 
    limit: 4,
    categorySlug: categorySlug 
  })
  const articles = articlesData?.data || []
  
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <Link key={article.id} href={`/articles/${article.slug}`}>
            <div className="flex gap-4 group cursor-pointer">
              <div className="relative w-32 h-24 flex-shrink-0">
                <Image
                  src={article.featuredImage ? `${process.env.NEXT_PUBLIC_BASE_URL}${article.featuredImage}` : "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover rounded group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-red-600 text-xs">{article.category.name}</span>
                  <span className="text-gray-500 text-xs">
                    {formatDate(article.publishedAt || article.createdAt)}
                  </span>
                </div>
                <h3 className="font-medium text-sm mb-1 group-hover:text-red-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-xs line-clamp-2">
                  {article.excerpt || article.content?.substring(0, 100) + '...'}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
