import { ArrowRight, ShoppingCart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { openWhatsApp } from "@/lib/whatsapp";

interface OfferProduct {
  id: number;
  name: string;
  sku: string;
  image: string;
  specifications: string[];
  badge: "OFERTA" | "IMBATÍVEL";
  category: string;
}

const offerProducts: OfferProduct[] = [
  {
    id: 1,
    name: "Furadeira de Impacto Profissional",
    sku: "FIP-850W",
    image: "/public/placeholder.svg",
    specifications: ["850W de potência", "Mandril 13mm", "Velocidade variável"],
    badge: "OFERTA",
    category: "Ferramentas Elétricas"
  },
  {
    id: 2,
    name: "Capacete de Segurança com Jugular",
    sku: "CS-CA-001",
    image: "/public/placeholder.svg", 
    specifications: ["Certificação INMETRO", "Material ABS", "Cores variadas"],
    badge: "IMBATÍVEL",
    category: "EPIs"
  },
  {
    id: 3,
    name: "Barra Chata Aço 1020",
    sku: "BC-1020-50X6",
    image: "/public/placeholder.svg",
    specifications: ["50mm x 6mm", "Aço 1020", "Comprimento 6m"],
    badge: "OFERTA",
    category: "Ferro & Aço"
  },
  {
    id: 4,
    name: "Parafusadeira à Bateria 12V",
    sku: "PB-12V-LI",
    image: "/public/placeholder.svg",
    specifications: ["Bateria 12V Li-ion", "LED de trabalho", "Carregador incluído"],
    badge: "IMBATÍVEL",
    category: "Ferramentas à Bateria"
  },
  {
    id: 5,
    name: "Luva de Segurança Látex",
    sku: "LS-LAT-G",
    image: "/public/placeholder.svg",
    specifications: ["Palma texturizada", "CA válido", "Tamanhos P ao GG"],
    badge: "OFERTA",
    category: "EPIs"
  },
  {
    id: 6,
    name: "Chave de Fenda Isolada 1000V",
    sku: "CFI-1000V-6",
    image: "/public/placeholder.svg",
    specifications: ["Isolamento 1000V", "Cabo ergonômico", "Ponta 6mm"],
    badge: "IMBATÍVEL", 
    category: "Ferramentas Manuais"
  },
  {
    id: 7,
    name: "Eletrodo de Solda E6013",
    sku: "ES-6013-25",
    image: "/public/placeholder.svg",
    specifications: ["Diâmetro 2,5mm", "Pacote 5kg", "Alta qualidade"],
    badge: "OFERTA",
    category: "Solda & Acessórios"
  },
  {
    id: 8,
    name: "Óculos de Proteção Incolor",
    sku: "OP-INC-UV",
    image: "/public/placeholder.svg",
    specifications: ["Proteção UV", "Antiembaçante", "Ajuste nasal"],
    badge: "IMBATÍVEL",
    category: "EPIs"
  }
];

export default function WeeklyOffers() {
  const handleProductWhatsApp = (product: OfferProduct) => {
    openWhatsApp({
      context: `Gostaria de um orçamento para ${product.name} (${product.sku})`
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

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {offerProducts.map((product) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                        <Card className="h-full hover-lift border-none shadow-premium bg-white relative overflow-hidden group">
                          {/* Premium Badge */}
                          <div className="absolute top-4 left-4 z-10">
                            <span className={`badge-offer ${
                              product.badge === "OFERTA" 
                                ? "" 
                                : "badge-premium"
                            }`}>
                              {product.badge}
                            </span>
                          </div>

                  <CardContent className="p-6">
                    {/* Product Image */}
                    <div className="aspect-square bg-secondary rounded-lg mb-4 overflow-hidden">
                      <img 
                        src={product.image} 
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
                        <p className="text-sm text-muted-foreground">
                          SKU: {product.sku}
                        </p>
                      </div>

                      {/* Specifications */}
                      <ul className="space-y-1">
                        {product.specifications.map((spec, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0"></span>
                            {spec}
                          </li>
                        ))}
                      </ul>

                      {/* Price */}
                      <div className="pt-2 border-t border-border">
                        <p className="text-lg font-semibold text-primary">
                          Preço sob consulta
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