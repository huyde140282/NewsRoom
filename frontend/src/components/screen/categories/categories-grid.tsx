import Link from "next/link";
import { Category } from '@/lib/api';
import { getCategoriesAction } from '@/lib/actions';
import { ErrorMessage } from '@/components/ui/error';

export default async function ServerCategoriesGrid() {
  const { data: categories, error } = await getCategoriesAction();
  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Categories</h1>
      </div>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category: Category) => (
            <Link key={category.id} href={`/category/${category.slug}`}>
              <div className="group cursor-pointer">
                <div className="relative h-48 mb-3 rounded-lg overflow-hidden">
                  <div 
                    className="absolute inset-0 group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundColor: category.color || '#6b7280' }}
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
                      {category.description && (
                        <p className="text-sm opacity-90 px-4">{category.description}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium group-hover:text-red-600 transition-colors">
                    {category.name}
                  </h3>
                  <span className="text-sm text-gray-500">View Articles</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No categories available</h3>
          <p className="text-gray-600">Categories will appear here when they are created.</p>
        </div>
      )}
    </div>
  );
}
