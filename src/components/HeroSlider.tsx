import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { HeroSlide } from '@/lib/types';
import { getPublicUrl } from '@/lib/supabase';

interface HeroSliderProps {
  slides: HeroSlide[];
}

export function HeroSlider({ slides }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const go = (dir: number) => {
    setCurrent((c) => (c + dir + slides.length) % slides.length);
  };

  return (
    <div className="relative aspect-[1080/1350] w-full overflow-hidden bg-primary-100 sm:aspect-[1400/520]">
      {slides.map((slide, i) => {
        const desktopUrl = getPublicUrl(slide.desktop_image_path ?? slide.image_path ?? null);
        const mobileUrl = getPublicUrl(slide.mobile_image_path ?? slide.image_path ?? null);
        return (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {mobileUrl && (
              <img
                src={mobileUrl}
                alt={slide.title}
                className="h-full w-full object-cover object-center sm:hidden"
              />
            )}
            {desktopUrl && (
              <img
                src={desktopUrl}
                alt={slide.title}
                className="hidden h-full w-full object-contain object-center sm:block"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16">
              <h2 className="animate-fade-in font-serif text-3xl font-bold text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
                {slide.title}
              </h2>
            </div>
          </div>
        );
      })}

      {slides.length > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/30 p-2 text-white backdrop-blur transition-colors hover:bg-white/50"
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => go(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/30 p-2 text-white backdrop-blur transition-colors hover:bg-white/50"
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current ? 'w-8 bg-white' : 'w-2 bg-white/50'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
