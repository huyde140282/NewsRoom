import HeroSection from "@/components/screen/homepage/hero-section"
import FeaturedSection from "@/components/screen/homepage/featured-section"
import CategorySection from "@/components/screen/homepage/category-section"
import PopularSection from "@/components/screen/homepage/popular-section"
import LatestSection from "@/components/screen/homepage/latest-section"
import Breadcrumb from '@/components/ui/breadcrumb'

export default function HomePage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', active: true }]} />
      <div className="space-y-8">
        <HeroSection />
        <FeaturedSection />
        <CategorySection title="Business" categorySlug="business" />
        <CategorySection title="Technology" categorySlug="technology" />
        <CategorySection title="Entertainment" categorySlug="entertainment" />
        <CategorySection title="Sports" categorySlug="sports" />
        <PopularSection />
        <LatestSection />
      </div>
    </>
  )
}
