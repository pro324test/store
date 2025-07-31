'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

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

interface ImageSliderProps {
  slides: SlideItem[];
  autoPlay?: boolean;
  autoPlayDelay?: number;
  enableTouch?: boolean;
  showPlayPause?: boolean;
}

export function ImageSlider({ 
  slides, 
  autoPlay = true, 
  autoPlayDelay = 5000,
  enableTouch = true,
  showPlayPause = false
}: ImageSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('slider');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const isArabic = locale === 'ar';
  const isRTL = isArabic;

  // Clear interval function
  const clearAutoPlayInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Set up auto-play functionality
  const setupAutoPlay = useCallback(() => {
    if (!isPlaying || slides.length <= 1) {
      clearAutoPlayInterval();
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayDelay);
  }, [isPlaying, autoPlayDelay, slides.length, clearAutoPlayInterval]);

  // Auto-play effect
  useEffect(() => {
    setupAutoPlay();
    return clearAutoPlayInterval;
  }, [setupAutoPlay, clearAutoPlayInterval]);

  // Navigation functions
  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    
    // Reset transition flag after animation
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;
    const newIndex = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(newIndex);
  }, [currentSlide, slides.length, goToSlide, isTransitioning]);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    const newIndex = (currentSlide + 1) % slides.length;
    goToSlide(newIndex);
  }, [currentSlide, slides.length, goToSlide, isTransitioning]);

  // Touch handling
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableTouch) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enableTouch) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!enableTouch || !touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    // For RTL, reverse the swipe logic
    if (isRTL) {
      if (isLeftSwipe) goToPrevious();
      if (isRightSwipe) goToNext();
    } else {
      if (isLeftSwipe) goToNext();
      if (isRightSwipe) goToPrevious();
    }
  };

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      isRTL ? goToNext() : goToPrevious();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      isRTL ? goToPrevious() : goToNext();
    } else if (e.key === ' ') {
      e.preventDefault();
      setIsPlaying(prev => !prev);
    }
  }, [isRTL, goToNext, goToPrevious]);

  // Keyboard event listener
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.addEventListener('keydown', handleKeyDown);
    return () => slider.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  if (slides.length === 0) {
    return null;
  }

  const currentSlideData = slides[currentSlide];
  const title = isArabic ? currentSlideData.title : currentSlideData.titleEn;
  const description = isArabic ? currentSlideData.description : currentSlideData.descriptionEn;
  const buttonText = currentSlideData.buttonText 
    ? (isArabic ? currentSlideData.buttonText : currentSlideData.buttonTextEn)
    : t('shop_now');

  // Calculate transform value based on direction
  const getTransformValue = () => {
    if (isRTL) {
      return `translateX(${currentSlide * 100}%)`;
    }
    return `translateX(-${currentSlide * 100}%)`;
  };

  return (
    <div 
      ref={sliderRef}
      className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      role="region"
      aria-label={t('image_slider')}
      aria-live="polite"
      tabIndex={0}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div
        className={`flex transition-transform duration-500 ease-in-out h-full ${isRTL ? 'flex-row-reverse' : ''}`}
        style={{ transform: getTransformValue() }}
        aria-label={`${t('slide')} ${currentSlide + 1} ${t('of')} ${slides.length}`}
      >
        {slides.map((slide, index) => (
          <div key={slide.id} className="min-w-full h-full relative">
            <Image
              src={slide.image}
              alt={isArabic ? slide.title : slide.titleEn}
              fill
              sizes="100vw"
              className="object-cover"
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
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
        ))}
      </div>

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className={`absolute top-1/2 ${isRTL ? 'end-4' : 'start-4'} transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg`}
            onClick={isRTL ? goToNext : goToPrevious}
            aria-label={isRTL ? t('next_slide') : t('previous_slide')}
          >
            {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`absolute top-1/2 ${isRTL ? 'start-4' : 'end-4'} transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg`}
            onClick={isRTL ? goToPrevious : goToNext}
            aria-label={isRTL ? t('previous_slide') : t('next_slide')}
          >
            {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </>
      )}

      {/* Play/Pause button */}
      {showPlayPause && slides.length > 1 && (
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 end-4 bg-white/80 hover:bg-white shadow-lg"
          onClick={togglePlayPause}
          aria-label={isPlaying ? t('pause') : t('play')}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      )}

      {/* Dots indicator */}
      {slides.length > 1 && (
        <div className={`absolute bottom-4 ${isRTL ? 'end-1/2 transform translate-x-1/2' : 'start-1/2 transform -translate-x-1/2'} flex gap-2`}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all shadow-lg ${
                index === currentSlide ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/75'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`${t('go_to_slide')} ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Screen reader information */}
      <div className="sr-only">
        {t('slide_info', { current: currentSlide + 1, total: slides.length })}
      </div>
    </div>
  );
}