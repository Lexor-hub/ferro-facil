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
    const fetchBanners = async () => {
      try {
        const { data, error } = await supabase
          .from('banners')
          .select('id, title, image_url, alt_text, href')
          .eq('is_active', true)
          .gte('end_date', new Date().toISOString().split('T')[0])
          .lte('start_date', new Date().toISOString().split('T')[0])
          .order('position');

        if (error) throw error;
        
        if (data && data.length > 0) {
          setSlides(data);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
        // Keep fallback slides on error
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

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

  const currentSlideData = slides[currentSlide];
  
  if (loading) {
    return (
      <section className="relative overflow-hidden w-full aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9] lg:aspect-[5/2] min-h-[300px] max-h-[80vh] bg-secondary animate-pulse">
      </section>
    );
  }

  return (
    <section 
      className="relative overflow-hidden w-full aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9] lg:aspect-[5/2] min-h-[300px] max-h-[80vh]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image Container */}
      <div className="relative w-full h-full">
        {currentSlideData.href ? (
          <a href={currentSlideData.href} target="_blank" rel="noopener noreferrer">
            <img
              src={currentSlideData.image_url}
              alt={currentSlideData.alt_text || currentSlideData.title || 'Banner'}
              className="w-full h-full object-cover object-center"
              loading={currentSlide === 0 ? "eager" : "lazy"}
            />
          </a>
        ) : (
          <img
            src={currentSlideData.image_url}
            alt={currentSlideData.alt_text || currentSlideData.title || 'Banner'}
            className="w-full h-full object-cover object-center"
            loading={currentSlide === 0 ? "eager" : "lazy"}
          />
        )}
        
        {/* Slide Indicators (Dots) */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
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
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
        aria-label="Próximo slide"
      >
        <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>
    </section>
  );
}