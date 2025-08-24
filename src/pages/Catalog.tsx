import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/HeroSection";
import CategoryChips from "@/components/CategoryChips";
import { openWhatsApp } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";
import { 
  Package, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Search,
  AlertCircle
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string | null;
  status: string;
  images: string[];
  bullet_points: string[];
}

const categories = [
  { id: "elevacao", name: "Equipamentos de Elevação", icon: "🏗️" },
  { id: "maquinas-pesadas", name: "Máquinas Pesadas", icon: "🚜" },
  { id: "transporte", name: "Transporte Especializado", icon: "🚛" },
  { id: "ferramentas", name: "Ferramentas Pneumáticas", icon: "🔧" },
  { id: "hidraulicos", name: "Sistemas Hidráulicos", icon: "💧" },
  { id: "compressores", name: "Compressores Industriais", icon: "⚙️" },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "available":
      return { 
        label: "Disponível", 
        variant: "default" as const, 
        color: "bg-green-100 text-green-800",
        icon: CheckCircle2
      };
    case "unavailable":
      return { 
        label: "Indisponível", 
        variant: "destructive" as const, 
        color: "bg-red-100 text-red-800",
        icon: AlertTriangle
      };
    case "coming-soon":
      return { 
        label: "Em Breve", 
        variant: "secondary" as const, 
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock
      };
    default:
      return { 
        label: "Consultar", 
        variant: "outline" as const, 
        color: "bg-gray-100 text-gray-800",
        icon: AlertCircle
      };
  }
};

const Catalog = () => {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Catálogo de Produtos"
        subtitle="Descubra nossa linha completa de equipamentos e soluções industriais. Solicite orçamentos personalizados diretamente pelo WhatsApp."
        primaryCTA="Ver produtos"
        secondaryCTA="Falar com especialista"
        onSecondaryCTA={() => openWhatsApp({ context: "Gostaria de falar com um especialista sobre produtos" })}
      />

      {/* Category Navigation */}
      <CategoryChips 
        categories={[
          { id: "todos", name: "Todos", icon: "📦" },
          ...categories
        ]}
        activeCategory={activeCategory}
        onCategoryClick={setActiveCategory}
      />

      {/* Products Content */}
      <div className="py-12">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando produtos...</p>
            </div>
          ) : (
            <>
              {categories.map(category => {
                const categoryProducts = products.filter(p => 
                  activeCategory === "todos" || p.category === category.id
                );
                
                if (categoryProducts.length === 0 && activeCategory !== "todos") return null;
                if (activeCategory !== "todos" && activeCategory !== category.id) return null;
                
                return (
                  <section key={category.id} className="mb-16">
                    {(activeCategory === "todos" || activeCategory === category.id) && categoryProducts.length > 0 && (
                      <>
                         <div className="flex items-center gap-3 mb-8">
                           <div className="p-2 bg-primary/10 rounded-lg">
                             <span className="text-2xl">{category.icon}</span>
                           </div>
                           <h2 className="text-2xl font-bold">{category.name}</h2>
                         </div>
                        
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                          {categoryProducts.map((product) => (
                            <Card key={product.id} className="hover-lift shadow-card group">
                              <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                  <h3 className="font-semibold text-lg">{product.name}</h3>
                                  <Badge 
                                    variant={getStatusConfig(product.status).variant}
                                    className={`ml-2 ${getStatusConfig(product.status).color}`}
                                  >
                                    {getStatusConfig(product.status).label}
                                  </Badge>
                                </div>
                                
                                {product.description && (
                                  <p className="text-sm text-muted-foreground mb-4">
                                    {product.description}
                                  </p>
                                )}
                                
                                {product.bullet_points.length > 0 && (
                                  <ul className="space-y-2 mb-6">
                                    {product.bullet_points.map((point, index) => (
                                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                        {point}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                                
                                <Button 
                                  className="w-full group-hover:shadow-lg transition-all"
                                  onClick={() => openWhatsApp({ item: product.name })}
                                >
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  Solicitar orçamento
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </>
                    )}
                  </section>
                );
              })}
              
              {/* Show all products when "todos" is selected */}
              {activeCategory === "todos" && (
                <section className="mb-16">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Todos os Produtos</h2>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                      <Card key={product.id} className="hover-lift shadow-card group">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <Badge 
                              variant={getStatusConfig(product.status).variant}
                              className={`ml-2 ${getStatusConfig(product.status).color}`}
                            >
                              {getStatusConfig(product.status).label}
                            </Badge>
                          </div>
                          
                          {product.description && (
                            <p className="text-sm text-muted-foreground mb-4">
                              {product.description}
                            </p>
                          )}
                          
                          {product.bullet_points.length > 0 && (
                            <ul className="space-y-2 mb-6">
                              {product.bullet_points.map((point, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          )}
                          
                          <Button 
                            className="w-full group-hover:shadow-lg transition-all"
                            onClick={() => openWhatsApp({ item: product.name })}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Solicitar orçamento
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
              
              {products.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Nenhum produto encontrado
                  </h3>
                  <p className="text-muted-foreground">
                    Não há produtos disponíveis no momento.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
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
              size="lg"
              className="bg-gradient-primary hover:shadow-lg"
            >
              <Search className="w-5 h-5 mr-2" />
              Buscar produto específico
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Catalog;