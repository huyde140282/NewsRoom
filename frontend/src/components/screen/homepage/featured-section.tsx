import Image from "next/image"
import Link from "next/link"
import { getFeaturedArticles } from "@/lib/server-actions"

export default async function FeaturedSection() {
  const result = await getFeaturedArticles();
  const articlesData =
    Array.isArray(result)
      ? result
      : result.data;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Featured</h2>
        <Link href="/articles" className="text-red-600 text-sm hover:underline">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {articlesData.slice(0, 4).map((article) => (
          <Link key={article.id} href={`/articles/${article.slug}`}>
            <div className="relative group cursor-pointer">
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src={article.featuredImage ? `${process.env.NEXT_PUBLIC_BASE_URL}${article.featuredImage}` : "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="text-xs mb-1 opacity-80">
                    {article.category.name}
                  </div>
                  <h3 className="font-medium text-sm line-clamp-2">{article.title}</h3>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
