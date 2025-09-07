import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Monitor, 
  Briefcase, 
  Trophy, 
  Heart, 
  Film, 
  Atom,
  Bookmark 
} from 'lucide-react';
import { Category } from '@/lib/api';

const categoryIcons: Record<string, any> = {
  technology: Monitor,
  business: Briefcase,
  sports: Trophy,
  health: Heart,
  entertainment: Film,
  science: Atom,
};

const categoryColors: Record<string, string> = {
  technology: '#3b82f6', // blue
  business: '#059669',   // green
  sports: '#dc2626',     // red
  health: '#ea580c',     // orange
  entertainment: '#7c3aed', // purple
  science: '#0891b2',    // cyan
};

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const Icon = categoryIcons[category.slug] || Bookmark;
  const color = categoryColors[category.slug] || '#6b7280';

  return (
    <Card className="group hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden">
      <Link href={`/category/${category.slug}`}>
        <div className="relative">
          {/* Background with gradient */}
          <div 
            className="h-24 flex items-center justify-center relative"
            style={{ 
              background: `linear-gradient(135deg, ${color}dd, ${color}aa)`,
            }}
          >
            <Icon className="text-white" size={32} />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          
          {/* Content */}
          <CardContent className="p-4">
            <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors line-clamp-1">
              {category.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {category.articleCount || 0} articles
            </p>
          </CardContent>
        </div>
      </Link>
    </Card>
  );
}
