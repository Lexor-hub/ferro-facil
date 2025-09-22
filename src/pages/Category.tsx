import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Search, ShoppingCart, AlertCircle, Award, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
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

interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  price?: number;
  category_id: string;
  is_active: boolean;
  is_bestseller?: boolean;
  images?: Array<{
    url: string;
    alt_text?: string;
    sort_order: number;
  }>;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
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
  return imageMap[categorySlug] || ferroAcoImg;
};

// Descriptions for categories
const categoryDescriptions: { [key: string]: string } = {
  "ferro-aco": "Vergalhões, perfis, chapas e mais. A base para sua construção com a máxima qualidade e durabilidade.",
  "epis": "Segurança em primeiro lugar. Equipamentos de Proteção Individual para garantir a integridade da sua equipe.",
  "consumiveis-tecnicos": "Eletrodos, abrasivos e outros itens essenciais para processos de solda e acabamento.",
  "insumos-industriais": "Soluções completas para a indústria, de parafusos a componentes específicos para suas máquinas.",
  "ferramentas-eletricas": "Potência e precisão para o seu trabalho. As melhores marcas de ferramentas elétricas do mercado.",
  "ferramentas-bateria": "Mobilidade e eficiência. Ferramentas à bateria para trabalhos em qualquer lugar, sem abrir mão da performance.",
  "ferramentas-manuais": "Robustez e confiança. Ferramentas manuais projetadas para resistir ao dia a dia da indústria.",
  "solda-acessorios": "Tudo para o processo de soldagem, de tochas e consumíveis a acessórios que garantem um trabalho perfeito."
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

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryNotFound, setCategoryNotFound] = useState(false);

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!slug) {
        setCategoryNotFound(true);
        setLoading(false);
        return;
      }

      try {
        // Fetch category info
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .eq('is_active', true)
          .single();

        if (categoryError) {
          setCategoryNotFound(true);
          setLoading(false);
          return;
        }

        setCategory(categoryData);

        // Fetch products for this category
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
          .eq('category_id', categoryData.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (productsError) {
          console.error('Error fetching products:', productsError);
        } else if (productsData) {
          // Mark some as bestsellers (in real implementation this would come from database)
          const bestsellers = new Set([productsData[0]?.id, productsData[2]?.id]);

          const processedProducts = productsData.map(product => ({
            ...product,
            is_bestseller: bestsellers.has(product.id),
            images: product.product_images?.sort((a, b) => a.sort_order - b.sort_order)
          }));

          setProducts(processedProducts);
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
        setCategoryNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug]);

  if (categoryNotFound) {
    return <Navigate to="/catalogo" replace />;
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-header">
      {/* Header Section */}
      <section className="py-12 bg-gradient-premium">
        <div className="container-custom">
          <div className="flex items-center mb-6">
            <Link to="/catalogo" className="mr-4 text-white hover:text-white/80 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-4xl">{category && getIconForCategory(category.slug)}</span>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white">
                  {category?.name}
                </h1>
                <p className="text-lg text-white/80 mt-2">
                  {category && categoryDescriptions[category.slug]}
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70" />
            <Input
              type="text"
              placeholder="Buscar produtos nesta categoria..."
              className="w-full rounded-full bg-white/10 border-white/30 placeholder:text-white/70 text-white pl-12 pr-4 py-3 focus:ring-2 focus:ring-white/50 focus:border-white/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-secondary animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-muted-foreground">
                  {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const statusConfig = getStatusConfig(product);
                  const categoryImage = getCategoryImage(category?.slug || '');
                  const productImage = product.images?.[0]?.url || categoryImage;
                  const bullets = formatDescription(product);

                  return (
                    <Card key={product.id} className="overflow-hidden hover-lift border-none shadow-card h-full flex flex-col">
                      {/* Product Image */}
                      <div className="aspect-[4/3] bg-secondary overflow-hidden relative">
                        {product.is_bestseller && (
                          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full flex items-center gap-1 z-10 shadow-md">
                            <Award className="h-4 w-4" />
                            <span className="text-xs font-bold">Mais Vendido</span>
                          </div>
                        )}
                        <img
                          src={productImage}
                          alt={product.images?.[0]?.alt_text || `${product.name} - ${category?.name}`}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          onError={(e) => {
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
                          className="w-full mt-auto text-white hover:text-white"
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
            </>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum produto encontrado</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? `Não encontramos produtos que correspondam à sua busca "${searchQuery}".`
                  : "Esta categoria ainda não possui produtos cadastrados."
                }
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  disabled={!searchQuery}
                >
                  Limpar busca
                </Button>
                <Button
                  onClick={() => openWhatsApp({ context: `Gostaria de ver produtos da categoria ${category?.name}` })}
                  variant="whatsapp"
                >
                  Falar com especialista
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}