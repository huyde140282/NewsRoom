
import Image from "next/image"
import Link from "next/link"
import { getArticles } from "@/lib/server-actions"

export default async function PopularSection() {
 const articlesData = await getArticles({
    limit: 4,
  });
  const articles = articlesData.data

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Popular</h2>
        <Link href="/articles" className="text-red-600 hover:underline">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.slice(0, 4).map((article) => (
          <Link key={article.id} href={`/articles/${article.slug}`}>
            <div className="group cursor-pointer">
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={article.featuredImage ? `${process.env.NEXT_PUBLIC_BASE_URL}${article.featuredImage}` : "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex items-center gap-2 mb-2 text-xs">
                <span className="text-red-600">{article.category.name}</span>
                <span className="text-gray-500">
                  {new Date(article.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-semibold mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3">
                {article.excerpt || article.content?.substring(0, 150) + '...'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
