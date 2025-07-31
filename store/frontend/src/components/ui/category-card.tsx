import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";

interface Subcategory {
  id: number;
  name: string;
  nameEn: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
}

interface Category {
  id: number;
  name: string;
  nameEn: string;
  description?: string;
  descriptionEn?: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
  subcategories: Subcategory[];
}

interface CategoryCardProps {
  category: Category;
  showSubcategories?: boolean;
}

export function CategoryCard({ category, showSubcategories = false }: CategoryCardProps) {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('categories');
  
  const isArabic = locale === 'ar';
  const categoryName = isArabic ? category.name : category.nameEn;
  const categoryDescription = isArabic ? category.description : category.descriptionEn;
  
  // For now, we'll use placeholder images. In a real app, categories would have image fields
  const imageSrc = `/images/categories/${category.slug}.jpg`;
  const fallbackImageSrc = '/images/placeholder-category.jpg';

  return (
    <Link href={`/${locale}/categories/${category.slug}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={imageSrc}
            alt={categoryName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = fallbackImageSrc;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 start-4 end-4">
            <h3 className="text-white font-bold text-lg group-hover:text-yellow-300 transition-colors">
              {categoryName}
            </h3>
            {categoryDescription && (
              <p className="text-white/80 text-sm mt-1 line-clamp-2">
                {categoryDescription}
              </p>
            )}
          </div>
        </div>
        
        {showSubcategories && category.subcategories.length > 0 && (
          <CardContent className="p-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">
                {t('subcategories')}
              </h4>
              <div className="flex flex-wrap gap-1">
                {category.subcategories.slice(0, 3).map((sub) => (
                  <span
                    key={sub.id}
                    className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
                  >
                    {isArabic ? sub.name : sub.nameEn}
                  </span>
                ))}
                {category.subcategories.length > 3 && (
                  <span className="text-xs text-muted-foreground px-2 py-1">
                    +{category.subcategories.length - 3} {t('more')}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}