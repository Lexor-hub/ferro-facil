import { useState, useEffect, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";
import Autoplay from "embla-carousel-autoplay";

interface CarouselItemData {
  id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
}

// Fallback images if no carousel items are found
const fallbackImages = [
  {
    id: "fallback-1",
    image_url: "/frota-1.jpg",
    alt_text: "Frota de caminhões Grupo Soares estacionada no pátio da empresa",
    sort_order: 1
  },
  {
    id: "fallback-2", 
    image_url: "/frota-2.jpg",
    alt_text: "Caminhões com identidade visual Soares para entrega de materiais industriais",
    sort_order: 2
  },
  {
    id: "fallback-3",
    image_url: "/frota-3.jpg",
    alt_text: "Equipamentos de carga e frota logística da empresa Grupo Soares",
    sort_order: 3
  }
];

interface MachineCarouselProps {
  carouselKey?: string;
}

export default function MachineCarousel({ carouselKey = 'logistica' }: MachineCarouselProps) {
  const [images, setImages] = useState<CarouselItemData[]>(fallbackImages);
  const [loading, setLoading] = useState(true);
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  // Fetch carousel items from Supabase
  useEffect(() => {
    const fetchCarouselItems = async () => {
      try {
        // Get the specified carousel
        const { data: carousel, error: carouselError } = await supabase
          .from('carousels')
          .select('id')
          .eq('key', carouselKey)
          .single();

        if (carouselError) throw carouselError;

        if (carousel) {
          // Then get its items
          const { data: items, error: itemsError } = await supabase
            .from('carousel_items')
            .select('id, image_url, alt_text, sort_order')
            .eq('carousel_id', carousel.id)
            .eq('is_active', true)
            .order('sort_order');

          if (itemsError) throw itemsError;
          
          if (items && items.length > 0) {
            setImages(items);
          }
        }
      } catch (error) {
        console.error('Error fetching carousel items:', error);
        // Keep fallback images on error
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselItems();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="aspect-video rounded-xl bg-white/20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Carousel
        plugins={[plugin.current]}
        className="w-full max-w-lg mx-auto"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image.id}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="aspect-video rounded-xl overflow-hidden">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || 'Logística Grupo Soares'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
