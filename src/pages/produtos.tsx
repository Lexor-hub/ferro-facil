import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from '@/components/ui/product-card';
import { SectionHeader } from '@/components/ui/section-header';
import { openWhatsApp } from '@/lib/whatsapp';

interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  image_url?: string;
  category: string;
  sku?: string;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(url)')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching products:', error);
      } else if (data) {
        const formattedProducts = data.map(p => ({
          ...p,
          image_url: p.product_images?.[0]?.url
        }));
        setProducts(formattedProducts);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleProductAction = (product: Product) => {
    const identifier = product.sku ? `${product.name} (${product.sku})` : product.name;
    openWhatsApp({
      context: `Gostaria de um orçamento para ${identifier}`
    });
  };

  return (
    <div className="bg-background">
      <div className="container-custom py-12">
        <SectionHeader
          title="Nosso Catálogo de Produtos"
          subtitle="Explore nossa linha completa de ferramentas, equipamentos e materiais para o seu projeto."
          align="center"
          className="mb-12"
        />

        {/* TODO: Adicionar Filtros aqui */}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-[1.75rem] border border-white/10 bg-white/10 backdrop-blur-sm"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onQuoteClick={() => handleProductAction(product)}
              />
            ))}
          </div>
        )}

        {/* TODO: Adicionar Paginação aqui */}
      </div>
    </div>
  );
};

export default ProductsPage;