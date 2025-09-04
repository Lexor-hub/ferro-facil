import { useState, useEffect } from "react";
import { Search, Package, ShoppingCart, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import HeroSection from "@/components/HeroSection";
import CategoryChips from "@/components/CategoryChips";
import { openWhatsApp } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";

// Import category images
import ferroAcoImg from "@/assets/ferro-aco.jpg";
import episImg from "@/assets/epis.jpg";
import consumiveisTecnicosImg from "@/assets/consumiveis-tecnicos.jpg";
import insumosIndustriaisImg from "@/assets/insumos-industriais.jpg";
import ferramentasEletricasImg from "@/assets/ferramentas-eletricas.jpg";
import ferramentasBateriaImg from "@/assets/ferramentas-bateria.jpg";
import ferramentasManuaisImg from "@/assets/ferramentas-manuais.jpg";
import soldaAcessoriosImg from "@/assets/solda-acessorios.jpg";

interface Category {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  price?: number;
  category_id: string;
  is_active: boolean;
  images?: Array<{
    url: string;
    alt_text?: string;
    sort_order: number;
  }>;
}

// Category image mapping
const getCategoryImage = (categorySlug: string) => {
  const imageMap: { [key: string]: string } = {
    "ferro-aco": ferroAcoImg,
    "epis": episImg,
    "consumiveis-tecnicos": consumiveisTecnicosImg,
    "insumos-industriais": insumosIndustriaisImg,
    "ferramentas-eletricas": ferramentasEletricasImg,
    "ferramentas-bateria": ferramentasBateriaImg,
    "ferramentas-manuais": ferramentasManuaisImg,
    "solda-acessorios": soldaAcessoriosImg,
  };
  return imageMap[categorySlug] || ferroAcoImg; // fallback to first image
};

// Fallback categories if no data is found
const fallbackCategories = [
  { id: "ferro-aco", name: "Ferro & Aço", slug: "ferro-aco", is_active: true },
  { id: "epis", name: "EPIs", slug: "epis", is_active: true },
  { id: "consumiveis-tecnicos", name: "Consumíveis Técnicos", slug: "consumiveis-tecnicos", is_active: true },
  { id: "insumos-industriais", name: "Insumos Industriais", slug: "insumos-industriais", is_active: true },
  { id: "ferramentas-eletricas", name: "Ferramentas Elétricas", slug: "ferramentas-eletricas", is_active: true },
  { id: "ferramentas-bateria", name: "Ferramentas à Bateria", slug: "ferramentas-bateria", is_active: true },
  { id: "ferramentas-manuais", name: "Ferramentas Manuais", slug: "ferramentas-manuais", is_active: true },
  { id: "solda-acessorios", name: "Solda & Acessórios", slug: "solda-acessorios", is_active: true }
];

const getStatusConfig = (product: Product) => {
  if (product.price && product.price > 0) {
    return { label: "Em estoque", variant: "default" as const, color: "bg-green-100 text-green-800" };
  }
  return { label: "Sob consulta", variant: "secondary" as const, color: "bg-blue-100 text-blue-800" };
};

const formatDescription = (product: Product) => {
  if (product.description) {
    return product.description.split('•').map(item => item.trim()).filter(item => item.length > 0);
  }
  return [];
};

function getIconForCategory(slug: string): string {
  const iconMap: {[key: string]: string} = {
    "ferro-aco": "🔧",
    "epis": "🦺", 
    "consumiveis-tecnicos": "⚙️",
    "insumos-industriais": "🏭",
    "ferramentas-eletricas": "⚡",
    "ferramentas-bateria": "🔋",
    "ferramentas-manuais": "🔨",
    "solda-acessorios": "🔥"
  };
  return iconMap[slug] || "📦";
}

export default function Catalog() {
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [productsByCategory, setProductsByCategory] = useState<{[key: string]: Product[]}>({});
  const [loading, setLoading] = useState(true);

  // Fetch categories and products from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (categoriesError) throw categoriesError;

        if (categoriesData && categoriesData.length > 0) {
          setCategories(categoriesData);
        }

        // Fetch products with images
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            id,
            name,
            description,
            sku,
            price,
            category_id,
            is_active,
            product_images(url, alt_text, sort_order)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;

        // Group products by category
        if (productsData) {
          const groupedProducts: {[key: string]: Product[]} = {};
          
          productsData.forEach(product => {
            if (!groupedProducts[product.category_id]) {
              groupedProducts[product.category_id] = [];
            }
            groupedProducts[product.category_id].push({
              ...product,
              images: product.product_images?.sort((a, b) => a.sort_order - b.sort_order)
            });
          });
          
          setProductsByCategory(groupedProducts);
        }
      } catch (error) {
        console.error('Error fetching catalog data:', error);
        // Keep fallback data on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayCategories = categories.map(cat => ({ 
    id: cat.id, 
    name: cat.name, 
    icon: getIconForCategory(cat.slug) 
  }));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Catálogo — encontre por categoria"
        subtitle="Mais de 10.000 itens organizados para você encontrar exatamente o que precisa. Solicite orçamentos direto pelo WhatsApp."
        primaryCTA="Pedir orçamento"
        secondaryCTA="Falar com especialista"
        onSecondaryCTA={() => openWhatsApp({ context: "Gostaria de falar com um especialista sobre produtos" })}
        showQualityBanner={true}
      />

      {/* Category Navigation */}
      <CategoryChips 
        categories={displayCategories}
        activeCategory={activeCategory}
        onCategoryClick={setActiveCategory}
      />

      {/* Catalog Content */}
      <div className="py-12">
        {loading ? (
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-secondary animate-pulse rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : (
          categories.map((category) => {
            const products = productsByCategory[category.id] || [];
            if (products.length === 0) return null;
            return (
              <section key={category.id} id={category.slug} className="mb-20">
                <div className="container-custom">
                  <div className="flex items-center space-x-3 mb-8">
                    <span className="text-3xl">{getIconForCategory(category.slug)}</span>
                    <h2 className="text-3xl font-bold text-foreground">{category.name}</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => {
                      const statusConfig = getStatusConfig(product);
                      const categoryImage = getCategoryImage(category.slug);
                      const productImage = product.images?.[0]?.url || categoryImage;
                      const bullets = formatDescription(product);
                      
                      return (
                        <Card key={product.id} className="overflow-hidden hover-lift border-none shadow-card h-full flex flex-col">
                          {/* Product Image */}
                          <div className="aspect-[4/3] bg-secondary overflow-hidden">
                            <img 
                              src={productImage} 
                              alt={product.images?.[0]?.alt_text || `${product.name} - ${category.name}`}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              onError={(e) => {
                                // Fallback to category image if product image fails
                                const target = e.target as HTMLImageElement;
                                if (target.src !== categoryImage) {
                                  target.src = categoryImage;
                                }
                              }}
                            />
                          </div>
                          
                          <CardContent className="p-6 flex-1 flex flex-col">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-semibold text-lg text-foreground leading-tight flex-1 min-h-[3.5rem] line-clamp-2">
                                {product.name}
                              </h3>
                              <Badge className={`ml-2 ${statusConfig.color} border-none flex-shrink-0`}>
                                {statusConfig.label}
                              </Badge>
                            </div>
                            
                            {product.sku && (
                              <p className="text-sm text-muted-foreground mb-2">
                                SKU: {product.sku}
                              </p>
                            )}

                            {product.price && product.price > 0 && (
                              <p className="text-lg font-semibold text-primary mb-3">
                                R$ {product.price.toFixed(2)}
                              </p>
                            )}
                            
                            {bullets.length > 0 && (
                              <ul className="space-y-1 mb-6 flex-1">
                                {bullets.slice(0, 3).map((bullet, bulletIndex) => (
                                  <li key={bulletIndex} className="text-sm text-muted-foreground flex items-start">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                    {bullet}
                                  </li>
                                ))}
                              </ul>
                            )}
                            
                            <Button
                              onClick={() => openWhatsApp({ item: product.name })}
                              className="w-full mt-auto"
                              variant="default"
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Solicitar orçamento
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })
        )}
      </div>

      {/* Não encontrou? */}
      <section className="py-16 bg-gradient-subtle">
        <div className="container-custom text-center">
          <div className="max-w-2xl mx-auto">
            <AlertCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Não encontrou o que procura?
            </h2>
            <p className="text-muted-foreground mb-8">
              Nosso catálogo é muito mais amplo. Fale com nossos especialistas e encontre exatamente o que você precisa.
            </p>
            <Button
              onClick={() => openWhatsApp({ context: "Não encontrei o produto que procuro no catálogo" })}
              variant="hero"
              size="lg"
            >
              <Search className="w-5 h-5 mr-2" />
              Buscar produto específico
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}