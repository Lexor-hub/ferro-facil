import { useState, useEffect } from "react";
import { Search, ShoppingCart } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import NotFoundSection from "@/components/NotFoundSection";
import CategoryCard from "@/components/CategoryCard"; // Import the new component
import { openWhatsApp } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
  description?: string; // Add description to Category interface
  images?: Array<{
    url: string;
    alt_text?: string;
    sort_order: number;
  }>;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  price?: number;
  category_id: string;
  category?: {
    name: string;
    slug: string;
  };
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


type SearchFeedback = {
  message: string;
  tone: 'info' | 'error';
};

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchFeedback, setSearchFeedback] = useState<SearchFeedback | null>(null);
  const [isSearchingProduct, setIsSearchingProduct] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const navigate = useNavigate();

  // Fetch categories from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (categoriesError) throw categoriesError;

        if (categoriesData && categoriesData.length > 0) {
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Keep fallback data on error
      }
    };

    fetchCategories();
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Função para buscar produtos
  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setProducts([]);
      setIsLoadingProducts(false);
      return;
    }

    try {
      setIsLoadingProducts(true);
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
          categories(name, slug),
          product_images(url, alt_text, sort_order)
        `)
        .eq('is_active', true)
        .ilike('name', `%${query.trim()}%`)
        .order('name')
        .limit(20);

      if (productsError) throw productsError;

      const processedProducts = (productsData || []).map(product => ({
        ...product,
        category: product.categories ? {
          name: product.categories.name,
          slug: product.categories.slug
        } : undefined,
        images: product.product_images?.sort((a, b) => a.sort_order - b.sort_order)
      }));

      setProducts(processedProducts);
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Debounce para busca de produtos
  useEffect(() => {
    setSearchFeedback(null);
    const timeoutId = setTimeout(() => {
      if (normalizedQuery) {
        searchProducts(normalizedQuery);
      } else {
        setProducts([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const filteredCategories = normalizedQuery
    ? categories.filter((category) => {
        const nameMatch = category.name?.toLowerCase().includes(normalizedQuery);
        const slugMatch = category.slug?.toLowerCase().includes(normalizedQuery);
        const descriptionSource = category.description || categoryDescriptions[category.slug] || "";
        const descriptionMatch = descriptionSource.toLowerCase().includes(normalizedQuery);
        return nameMatch || slugMatch || descriptionMatch;
      })
    : categories;

  // Funções utilitárias para produtos
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

  const handleProductSearch = async () => {
    if (isSearchingProduct) {
      return;
    }

    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      setSearchFeedback({ message: "Digite o nome de um produto para buscar.", tone: 'error' });
      return;
    }

    try {
      setIsSearchingProduct(true);
      setSearchFeedback({ message: "Buscando produto...", tone: 'info' });
      const { data, error } = await supabase
        .from('products')
        .select('id')
        .eq('is_active', true)
        .ilike('name', `%${trimmedQuery}%`)
        .order('name')
        .limit(1);

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setSearchFeedback(null);
        navigate(`/produtos#produto-${data[0].id}`);
      } else {
        setSearchFeedback({ message: "Produto não encontrado. Tente outro termo ou fale com nossa equipe.", tone: 'error' });
      }
    } catch (error) {
      console.error('Error searching product:', error);
      setSearchFeedback({ message: "Não foi possível buscar o produto agora. Tente novamente em instantes.", tone: 'error' });
    } finally {
      setIsSearchingProduct(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Explore nosso Universo de Produtos"
        subtitle="Soluções completas em ferro, aço e tudo mais que sua indústria precisa."
        primaryCTA="Pedir orçamento"
        secondaryCTA="Falar com especialista"
        onSecondaryCTA={() => openWhatsApp({ context: "Gostaria de falar com um especialista sobre produtos" })}
        className="bg-blue-900"
      />

      {/* Search Bar */}
      <div className="container-custom py-6">
        <form
          className="relative"
          onSubmit={(e) => {
            e.preventDefault();
            handleProductSearch();
          }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar produtos e categorias..."
            className="w-full rounded-full bg-secondary border-transparent pl-12 pr-4 py-6 text-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Buscar produtos e categorias"
          />
          <button type="submit" className="sr-only">Buscar</button>
        </form>
        {searchFeedback ? (
          <p
            className={`mt-3 text-sm ${
              searchFeedback.tone === 'error' ? 'text-destructive' : 'text-primary'
            }`}
          >
            {isSearchingProduct ? 'Buscando produto...' : searchFeedback.message}
          </p>
        ) : null}
      </div>

      {/* Results Section */}
      <section className="py-12">
        <div className="container-custom">
          {normalizedQuery ? (
            /* Showing search results */
            <>
              {isLoadingProducts ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                  <p className="text-muted-foreground">Buscando produtos...</p>
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Produtos encontrados ({products.length})
                    </h2>
                    <p className="text-muted-foreground">
                      Resultados para "{searchQuery}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {products.map((product) => {
                      const statusConfig = getStatusConfig(product);
                      const categoryImage = getCategoryImage(product.category?.slug || '');
                      const productImage = product.images?.[0]?.url || categoryImage;
                      const bullets = formatDescription(product);

                      return (
                        <Card key={product.id} className="overflow-hidden hover-lift border-none shadow-card h-full flex flex-col">
                          <div className="aspect-[4/3] bg-secondary overflow-hidden relative">
                            <img
                              src={productImage}
                              alt={product.images?.[0]?.alt_text || `${product.name} - ${product.category?.name}`}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (target.src !== categoryImage) {
                                  target.src = categoryImage;
                                }
                              }}
                            />
                            {product.category && (
                              <div className="absolute top-2 left-2 bg-primary/90 text-white px-2 py-1 rounded-full text-xs font-medium">
                                {product.category.name}
                              </div>
                            )}
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
                <div className="rounded-3xl border border-dashed border-primary/30 bg-white/50 p-12 text-center shadow-sm mb-8">
                  <h3 className="text-2xl font-semibold text-foreground mb-3">
                    Nenhum produto encontrado para "{searchQuery}".
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Tente ajustar os termos da busca ou explore nossas categorias abaixo.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery("")}
                    className="mb-4"
                  >
                    Limpar busca
                  </Button>
                </div>
              )}

              {/* Show filtered categories when searching */}
              {filteredCategories.length > 0 && (
                <>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Categorias relacionadas
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredCategories.map((category) => (
                      <CategoryCard
                        key={category.id}
                        slug={category.slug}
                        title={category.name}
                        description={category.description || categoryDescriptions[category.slug] || "Descrição não disponível"}
                        image={getCategoryImage(category.slug)}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            /* Showing all categories when no search */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  slug={category.slug}
                  title={category.name}
                  description={category.description || categoryDescriptions[category.slug] || "Descrição não disponível"}
                  image={getCategoryImage(category.slug)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Não encontrou? */}
      <NotFoundSection
        title="Não encontrou o que procura?"
        description="Nosso catálogo é muito mais amplo. Fale com nossos especialistas e encontre exatamente o que você precisa."
        buttonText="Buscar produto específico"
        whatsappContext="Não encontrei o produto que procuro no catálogo"
      />
    </div>
  );
}
