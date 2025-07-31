import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";

interface ProductImage {
  id: number;
  alt?: string;
  title?: string;
  isDefault: boolean;
  sortOrder: number;
  fileUpload: {
    id: number;
    filename: string;
    path: string;
    mimetype: string;
  };
}

interface Category {
  id: number;
  name: string;
  nameEn: string;
  slug: string;
}

interface Brand {
  id: number;
  name: string;
  nameEn: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  nameEn: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  stockQuantity: number;
  isFeatured: boolean;
  category: Category;
  brand?: Brand;
  images: ProductImage[];
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('products');
  
  const isArabic = locale === 'ar';
  const productName = isArabic ? product.name : product.nameEn;
  const categoryName = isArabic ? product.category.name : product.category.nameEn;
  const brandName = product.brand ? (isArabic ? product.brand.name : product.brand.nameEn) : null;
  
  // Get the default image or first image
  const defaultImage = product.images.find(img => img.isDefault) || product.images[0];
  const imageSrc = defaultImage 
    ? `/api/uploads/${defaultImage.fileUpload.filename}` 
    : '/images/placeholder-product.jpg';
  
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPercentage = hasDiscount && product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <Link href={`/${locale}/products/${product.slug}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={imageSrc}
            alt={defaultImage?.alt || productName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {hasDiscount && (
            <div className="absolute top-2 start-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
              -{discountPercentage}%
            </div>
          )}
          {product.isFeatured && (
            <div className="absolute top-2 end-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-sm font-medium">
              {t('featured')}
            </div>
          )}
          {product.stockQuantity === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-medium">{t('out_of_stock')}</span>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-2">
            {brandName && (
              <p className="text-sm text-muted-foreground">{brandName}</p>
            )}
            <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
              {productName}
            </h3>
            <p className="text-sm text-muted-foreground">{categoryName}</p>
            
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-bold text-primary">
                {product.price.toLocaleString()} {t('currency')}
              </span>
              {hasDiscount && product.comparePrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {product.comparePrice.toLocaleString()} {t('currency')}
                </span>
              )}
            </div>
            
            {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
              <p className="text-sm text-orange-600">
                {t('only_left', { count: product.stockQuantity })}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}