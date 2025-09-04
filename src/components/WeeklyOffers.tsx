import { useState, useEffect } from "react";
import { ArrowRight, ShoppingCart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { openWhatsApp } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";

interface OfferProduct {
  id: string;
  name: string;
  sku?: string;
  description?: string;
  image?: string;
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
          .limit(8);

        if (error) throw error;
        
        if (data && data.length > 0) {
          const formattedProducts = data.map(item => ({
            id: item.products.id,
            name: item.products.name,
            sku: item.products.sku,
            description: item.products.description,
            category: item.products.category,
            price: item.products.price,
            image: item.products.product_images?.[0]?.url
          }));
          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error('Error fetching weekly specials:', error);
        // Keep fallback products on error
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklySpecials();
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
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            🔥 Ofertas Especiais desta Semana
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Produtos selecionados com condições especiais. Aproveite antes que acabem!
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-secondary animate-pulse rounded-lg"></div>
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
              {products.map((product, index) => (
                <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <Card className="h-full hover-lift border-none shadow-premium bg-white relative overflow-hidden group">
                    {/* Premium Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="badge-offer">
                        OFERTA
                      </span>
                    </div>

                  <CardContent className="p-6">
                    {/* Product Image */}
                    <div className="aspect-square bg-secondary rounded-lg mb-4 overflow-hidden">
                      <img 
                        src={product.image || "/placeholder.svg"} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">
                          {product.category}
                        </span>
                        <h3 className="font-semibold text-lg text-foreground line-clamp-2 mb-1">
                          {product.name}
                        </h3>
                        {product.sku && (
                          <p className="text-sm text-muted-foreground">
                            SKU: {product.sku}
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      {product.description && (
                        <div className="text-sm text-muted-foreground">
                          {product.description.split('•').map((spec, index) => (
                            <div key={index} className="flex items-center mb-1">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0"></span>
                              {spec.trim()}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Price */}
                      <div className="pt-2 border-t border-border">
                        <p className="text-lg font-semibold text-primary">
                          {product.price ? `R$ ${product.price.toFixed(2)}` : "Preço sob consulta"}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 pt-4">
                        <Button
                          onClick={() => handleProductWhatsApp(product)}
                          variant="default"
                          size="sm"
                          className="w-full font-medium"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Solicitar Orçamento
                        </Button>
                        <Button
                          onClick={() => handleProductWhatsApp(product)}
                          variant="whatsapp"
                          size="sm"
                          className="w-full font-medium"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          WhatsApp
                        </Button>
                      </div>
                    </div>
                    </CardContent>
                  </Card>
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