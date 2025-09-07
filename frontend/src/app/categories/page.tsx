import { Metadata } from 'next';
import CategoriesGrid from '@/components/screen/categories/categories-grid';
import Breadcrumb from '@/components/ui/breadcrumb';

export const metadata: Metadata = {
  title: 'All Categories - NewsRoom',
  description: 'Browse all article categories in NewsRoom. Find your favorite topics and discover new content.',
  keywords: 'categories, news, articles, topics, newsroom',
};

export default function CategoriesPage() {
    
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Categories', active: true }]} />
      <CategoriesGrid />
    </>
  );
}