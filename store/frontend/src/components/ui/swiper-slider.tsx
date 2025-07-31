'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

interface SlideItem {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  link?: string;
  buttonText?: string;
  buttonTextEn?: string;
}

interface SwiperSliderProps {
  slides: SlideItem[];
  autoPlay?: boolean;
  autoPlayDelay?: number;
}

export function SwiperSlider({ 
  slides, 
  autoPlay = true, 
  autoPlayDelay = 5000
}: SwiperSliderProps) {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('slider');
  
  const isArabic = locale === 'ar';
  const isRTL = isArabic;

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        direction="horizontal"
        autoplay={autoPlay ? {
          delay: autoPlayDelay,
          disableOnInteraction: false,
        } : false}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
        loop={slides.length > 1}
        className="h-full"
      >
        {slides.map((slide) => {
          const title = isArabic ? slide.title : slide.titleEn;
          const description = isArabic ? slide.description : slide.descriptionEn;
          const buttonText = slide.buttonText 
            ? (isArabic ? slide.buttonText : slide.buttonTextEn)
            : t('shop_now');

          return (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full">
                <Image
                  src={slide.image}
                  alt={title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-40" />
                <div className={`absolute inset-0 flex items-center ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className={`text-white max-w-4xl px-4 md:px-8 lg:px-16 ${isRTL ? 'mr-auto' : 'ml-auto'}`}>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                      {title}
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 leading-relaxed">
                      {description}
                    </p>
                    {slide.link && (
                      <Link href={slide.link}>
                        <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow">
                          {buttonText}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <style jsx global>{`
        .swiper-pagination {
          bottom: 16px !important;
        }
        
        .swiper-pagination-bullet {
          width: 12px !important;
          height: 12px !important;
          background: rgba(255, 255, 255, 0.5) !important;
          opacity: 1 !important;
          transition: all 0.3s ease !important;
        }
        
        .swiper-pagination-bullet-active {
          background: white !important;
          transform: scale(1.2) !important;
        }
      `}</style>
    </div>
  );
}