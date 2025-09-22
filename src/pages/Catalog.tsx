import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import CategoryChips from "@/components/CategoryChips";
import NotFoundSection from "@/components/NotFoundSection";
import CategoryCard from "@/components/CategoryCard"; // Import the new component
import { openWhatsApp } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);

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

  const displayCategories = categories.map(cat => ({ 
    id: cat.id, 
    name: cat.name, 
    icon: getIconForCategory(cat.slug) 
  }));

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

      {/* Category Navigation */}
      <CategoryChips 
        categories={displayCategories}
        activeCategory={activeCategory}
        onCategoryClick={setActiveCategory}
      />

      {/* Search Bar */}
      <div className="container-custom py-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nome do produto..."
            className="w-full rounded-full bg-secondary border-transparent pl-12 pr-4 py-6 text-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Cards Section */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                slug={category.slug}
                title={category.name}
                description={categoryDescriptions[category.slug] || "Descrição não disponível"}
                image={getCategoryImage(category.slug)}
              />
            ))}
          </div>
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