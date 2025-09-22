import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { SectionHeader } from "@/components/ui/section-header";
import { openWhatsApp } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ui/product-card";

interface OfferProduct {
  id: string;
  name: string;
  sku?: string;
  description?: string;
  image_url?: string;
  category: string;
  price?: number;
}

// Fallback products if no weekly specials are found
const fallbackProducts: OfferProduct[] = [
  {
    id: "fallback-1",
    name: "Furadeira de Impacto Profissional",
    sku: "FIP-850W",
    description: "850W de potência • Mandril 13mm • Velocidade variável",
    category: "Ferramentas Elétricas"
  },
  {
    id: "fallback-2",
    name: "Capacete de Segurança com Jugular",
    sku: "CS-CA-001",
    description: "Certificação INMETRO • Material ABS • Cores variadas",
    category: "EPIs"
  },
  {
    id: "fallback-3",
    name: "Barra Chata Aço 1020",
    sku: "BC-1020-50X6",
    description: "50mm x 6mm • Aço 1020 • Comprimento 6m",
    category: "Ferro & Aço"
  },
  {
    id: "fallback-4",
    name: "Parafusadeira à Bateria 12V",
    sku: "PB-12V-LI", 
    description: "Bateria 12V Li-ion • LED de trabalho • Carregador incluído",
    category: "Ferramentas à Bateria"
  }
];

export default function WeeklyOffers() {
  const [products, setProducts] = useState<OfferProduct[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);

  // Fetch weekly specials from Supabase
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchWeeklySpecials = async () => {
      try {
        const { data, error } = await supabase
          .from('weekly_specials')
          .select(`
            id,
            sort_order,
            products!inner(
              id,
              name,
              sku,
              description,
              category,
              price,
              is_active,
              product_images(url, alt_text, sort_order)
            )
          `)
          .eq('is_active', true)
          .eq('products.is_active', true)
          .order('sort_order')
          .limit(8)
          .abortSignal(signal);

        if (error) {
          if (error.name === 'AbortError') {
            console.log('Fetch aborted: Weekly Specials');
            return;
          }
          throw error;
        }
        
        if (data && data.length > 0) {
          const formattedProducts = data.map(item => ({
            id: item.products.id,
            name: item.products.name,
            sku: item.products.sku,
            description: item.products.description,
            category: item.products.category,
            price: item.products.price,
            image_url: item.products.product_images?.[0]?.url
          }));
          setProducts(formattedProducts);
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error fetching weekly specials:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklySpecials();

    return () => {
      controller.abort();
    };
  }, []);

  const handleProductWhatsApp = (product: OfferProduct) => {
    const identifier = product.sku ? `${product.name} (${product.sku})` : product.name;
    openWhatsApp({
      context: `Gostaria de um orçamento para ${identifier}`
    });
  };

  const handleViewAllOffers = () => {
    openWhatsApp({
      context: "Gostaria de ver todas as ofertas especiais desta semana"
    });
  };

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container-custom">
        <SectionHeader
          title="Ofertas Especiais desta Semana"
          subtitle="Produtos selecionados com condições especiais. Aproveite antes que acabem!"
          align="center"
          className="mb-16"
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-[1.75rem] border border-white/10 bg-white/10 backdrop-blur-sm"></div>
            ))}
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {products.map((product) => (
                <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <ProductCard 
                    product={product}
                    isOffer={true}
                    onQuoteClick={() => handleProductWhatsApp(product)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-8 lg:-left-12 bg-white shadow-card hover:shadow-card-hover" />
            <CarouselNext className="-right-8 lg:-right-12 bg-white shadow-card hover:shadow-card-hover" />
          </Carousel>
        )}

        {/* CTA Final */}
        <div className="text-center mt-12">
          <Button
            onClick={handleViewAllOffers}
            variant="accent" 
            size="lg"
            className="px-8 py-4 text-lg font-semibold group"
          >
            Ver todas as ofertas
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}
