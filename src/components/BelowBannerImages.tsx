import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type BelowBannerImage = Database['public']['Tables']['below_banner_images']['Row'];

const BelowBannerImages = () => {
  const [images, setImages] = useState<BelowBannerImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('below_banner_images')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: true });

        if (error) {
          if (error.code === 'PGRST205') {
            console.log('A tabela below_banner_images ainda não foi criada. Execute a migração do Supabase.');
            return;
          }
          console.error('Erro ao buscar imagens:', error);
          return;
        }

        setImages(data || []);
      } catch (error) {
        console.error('Erro ao buscar imagens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading || images.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white py-6">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {images.map((image) => (
              <CarouselItem key={image.id}>
                <div className="p-1">
                  <img
                    src={image.image_url}
                    alt={image.alt_text}
                    className="w-full h-auto rounded-lg shadow-sm"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>
    </div>
  );
};

export default BelowBannerImages;