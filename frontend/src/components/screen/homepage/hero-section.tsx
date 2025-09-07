
import Image from "next/image"
import Link from "next/link"
import { getArticles } from "@/lib/server-actions"

export default async function HeroSection() {
  const articlesData = await getArticles({
    page: 1,
    limit: 5,
  });


  const mainArticle = articlesData.data[0]
  const sideArticles = articlesData.data.slice(1, 4)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Small Articles */}
      <div className="space-y-4">
        {sideArticles.map((article) => (
          <Link key={article.id} href={`/articles/${article.slug}`} className="flex gap-3 hover:opacity-80">
            <Image 
              src={article.featuredImage ? `${process.env.NEXT_PUBLIC_BASE_URL}${article.featuredImage}` : "/placeholder.svg"} 
              alt={article.title} 
              width={80} 
              height={60} 
              className="rounded object-cover" 
            />
            <div>
              <h3 className="text-sm font-medium line-clamp-2">{article.title}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(article.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Hero Article */}
      <div className="md:col-span-2 relative">
        <Link href={`/articles/${mainArticle.slug}`}>
          <div className="relative h-80 rounded-lg overflow-hidden hover:opacity-90 transition-opacity">
            <Image 
              src={mainArticle.featuredImage ? `${process.env.NEXT_PUBLIC_BASE_URL}${mainArticle.featuredImage}` : "/placeholder.svg"} 
              alt={mainArticle.title} 
              fill 
              className="object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-600 px-2 py-1 text-xs rounded">
                  {mainArticle.category?.name || 'News'}
                </span>
                <span className="text-sm">
                  {new Date(mainArticle.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-2xl font-bold mb-2 line-clamp-2">
                {mainArticle.title}
              </h1>
              {mainArticle.excerpt && (
                <p className="text-sm opacity-90 line-clamp-2">
                  {mainArticle.excerpt}
                </p>
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
