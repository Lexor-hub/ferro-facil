import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SlideData {
  id: string;
  image_url: string;
  alt_text: string;
  title?: string;
  href?: string;
}

// Fallback slides if no banners are found
const fallbackSlides: SlideData[] = [
  {
    id: "fallback-1",
    image_url: "/lovable-uploads/c67254dd-b1c0-40b4-9575-1c2c43458ec9.png",
    alt_text: "Pediu? Chegou! Frota dedicada, estoque completo, entrega garantida"
  },
  {
    id: "fallback-2", 
    image_url: "/lovable-uploads/194e26b1-e624-499c-8f3f-6f5db9e72d92.png",
    alt_text: "Sua parceira técnica de confiança - Ferramentas, ferro, aço, insumos e EPIs"
  }
];

export default function HeroCarousel() {
  const [slides, setSlides] = useState<SlideData[]>(fallbackSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch banners from Supabase
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchBanners = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from('banners')
          .select('id, title, image_url, alt_text, href, start_date, end_date')
          .eq('is_active', true)
          .order('position')
          .abortSignal(signal);

        if (error) {
          if (error.name === 'AbortError') {
            console.log('Fetch aborted: Banners');
            return;
          }
          throw error;
        }
        
        if (data && data.length > 0) {
          // Filter banners based on date range
          const activeBanners = data.filter(banner => {
            if (!banner.start_date && !banner.end_date) {
              return true;
            }
            const startValid = !banner.start_date || banner.start_date <= today;
            const endValid = !banner.end_date || banner.end_date >= today;
            return startValid && endValid;
          });
          
          if (activeBanners.length > 0) {
            setSlides(activeBanners);
          }
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error fetching banners:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();

    return () => {
      controller.abort();
    };
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && slides.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, slides.length]);

  const handleMouseEnter = () => {
    setIsPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsPlaying(true);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (loading) {
    return (
      <section className="relative overflow-hidden w-full hero-banner-mobile bg-secondary animate-pulse" />
    );
  }

  // If there are no slides, don't render the carousel
  if (!slides || slides.length === 0) {
    return null;
  }

  const currentSlideData = slides[currentSlide];

  return (
    <section
      className="relative overflow-hidden w-full hero-banner-mobile"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image Container */}
      <div className="relative w-full h-full bg-gradient-to-br from-primary/10 to-accent/5 sm:bg-none">
        {currentSlideData.href ? (
          <a href={currentSlideData.href} target="_blank" rel="noopener noreferrer">
            <img
              src={currentSlideData.image_url}
              alt={currentSlideData.alt_text || currentSlideData.title || 'Banner'}
              className="w-full h-full object-contain sm:object-cover object-center sm:object-top"
              loading={currentSlide === 0 ? "eager" : "lazy"}
            />
          </a>
        ) : (
          <img
            src={currentSlideData.image_url}
            alt={currentSlideData.alt_text || currentSlideData.title || 'Banner'}
            className="w-full h-full object-contain sm:object-cover object-center sm:object-top"
            loading={currentSlide === 0 ? "eager" : "lazy"}
          />
        )}
        
        {/* Slide Indicators (Dots) */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white scale-110'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
        aria-label="Próximo slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
      </button>
    </section>
  );
}