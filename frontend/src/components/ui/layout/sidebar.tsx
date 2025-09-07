import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from '@/lib/utils';
import { getCategories, getTrendingArticles, getPopularTags } from '@/lib/server-actions';
import { Category, Article, Tag } from '@/lib/api';

export default async function ServerSidebar() {
  const [categories, trendingArticles, popularTags] = await Promise.all([
    getCategories(),
    getTrendingArticles(),
    getPopularTags(),
  ]);

  const displayCategories = categories.slice(0, 4);
  const displayTrending = trendingArticles.slice(0, 5);
  const displayTags = popularTags.slice(0, 12);

  return (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Categories</h3>
          <Link href="/categories" className="text-red-600 text-sm cursor-pointer hover:underline">
            View All
          </Link>
        </div>
        <div className="space-y-2">
          {displayCategories.length > 0 ? (
            displayCategories.map((category: Category) => (
              <div key={category.id}>
                <Link href={`/category/${category.slug}`}>
                  <div className="relative h-16 rounded-lg overflow-hidden cursor-pointer group">
                    <div 
                      className="absolute inset-0 group-hover:scale-105 transition-transform duration-300"
                      style={{ backgroundColor: category.color || '#6b7280' }}
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-medium">{category.name}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">No categories available</div>
          )}
        </div>
      </div>

      {/* Follow Us */}
      <div>
        <h3 className="text-lg font-bold mb-4">Follow Us</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">12,345 Fans</Button>
          <Button className="bg-blue-400 hover:bg-blue-500 text-white">12,345 Followers</Button>
          <Button className="bg-blue-800 hover:bg-blue-900 text-white">12,345 Connects</Button>
          <Button className="bg-pink-500 hover:bg-pink-600 text-white">12,345 Followers</Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white">12,345 Subscribers</Button>
          <Button className="bg-cyan-400 hover:bg-cyan-500 text-white">12,345 Followers</Button>
        </div>
      </div>

      {/* Newsletter */}
      <div>
        <h3 className="text-lg font-bold mb-4">Newsletter</h3>
        <p className="text-gray-600 text-sm mb-4">
          Stay updated with our latest news and articles delivered to your inbox.
        </p>
        <div className="flex gap-2">
          <Input type="email" placeholder="Your Email" className="flex-1" />
          <Button className="bg-red-600 hover:bg-red-700 text-white">Sign Up</Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">No spam receiving from us</p>
      </div>

      {/* Ad Space */}
      <div className="bg-gray-800 text-white p-8 text-center rounded">
        <div className="text-lg font-bold">&lt;html&gt;</div>
        <div className="text-sm">ADS 700x70px</div>
      </div>

      {/* Trending */}
      {displayTrending.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-4">Trending</h3>
          <div className="space-y-4">
            {displayTrending.map((article: Article) => (
              <Link key={article.id} href={`/articles/${article.slug}`} className="flex gap-3 group cursor-pointer">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${article.featuredImage || "/placeholder.svg"}`}
                  alt={article.title}
                  width={80}
                  height={60}
                  className="rounded object-cover flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-red-600 text-xs">{article.category.name}</span>
                    <span className="text-gray-500 text-xs">{formatDate(article.publishedAt || article.createdAt)}</span>
                  </div>
                  <h4 className="text-sm font-medium line-clamp-2 group-hover:text-red-600 transition-colors">
                    {article.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      <div>
        <h3 className="text-lg font-bold mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {displayTags.map((tag: Tag, index) => (
            <Link
              key={tag.id || `tag-${index}`}
              href={`/search?q=${encodeURIComponent(tag.name)}`}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-red-600 hover:text-white cursor-pointer transition-colors"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
