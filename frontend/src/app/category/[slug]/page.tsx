
import { ErrorMessage } from '@/components/ui/error';
import CategoryGrid from '@/components/screen/categories/category-grid';
import Breadcrumb from '@/components/ui/breadcrumb';
import { getCategoryBySlug } from '@/lib/server-actions';

interface CategoryPageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);
  const currentPage = Number(searchParams.page) || 1;
  
  if (!category) {
    return <ErrorMessage message="Category not found" />;
  }

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Category', href: '/categories' },
          { label: category.name, active: true }
        ]}
      />

      <CategoryGrid 
        categorySlug={params.slug} 
        categoryName={category.name} 
        page={currentPage}
      />
    </>
  );
}
