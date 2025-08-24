import { useState } from "react";
import { Search, Package, ShoppingCart, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import HeroSection from "@/components/HeroSection";
import CategoryChips from "@/components/CategoryChips";
import { openWhatsApp } from "@/lib/whatsapp";

const categories = [
  { id: "ferro-aco", name: "Ferro & Aço", icon: "🔧" },
  { id: "epis", name: "EPIs", icon: "🦺" },
  { id: "consumiveis-tecnicos", name: "Consumíveis Técnicos", icon: "⚙️" },
  { id: "insumos-industriais", name: "Insumos Industriais", icon: "🏭" },
  { id: "ferramentas-eletricas", name: "Ferramentas Elétricas", icon: "⚡" },
  { id: "ferramentas-bateria", name: "Ferramentas à Bateria", icon: "🔋" },
  { id: "ferramentas-manuais", name: "Ferramentas Manuais", icon: "🔨" },
  { id: "solda-acessorios", name: "Solda & Acessórios", icon: "🔥" }
];

const catalogItems = {
  "ferro-aco": [
    {
      title: "Vergalhão CA-50 Ø 10mm",
      status: "estoque" as const,
      bullets: ["Comprimento: 12m", "NBR 7480:2007", "Certificado de qualidade"],
      image: "/placeholder-product.jpg"
    },
    {
      title: "Chapa de Aço 1020 - 3mm",
      status: "sob_encomenda" as const,
      bullets: ["Dimensões: 1000x2000mm", "Acabamento natural", "Corte personalizado"],
      image: "/placeholder-product.jpg"
    },
    {
      title: "Perfil L 50x50x5mm",
      status: "estoque" as const,
      bullets: ["Comprimento: 6m", "Aço estrutural", "Galvanizado"],
      image: "/placeholder-product.jpg"
    }
  ],
  "epis": [
    {
      title: "Capacete de Segurança Class A",
      status: "estoque" as const,
      bullets: ["CA 31469", "Classe A - Isolamento elétrico", "Ajuste automático"],
      image: "/placeholder-product.jpg"
    },
    {
      title: "Luva de Vaqueta Reforçada",
      status: "estoque" as const,
      bullets: ["CA 12345", "Palma e dedos reforçados", "Punho de segurança"],
      image: "/placeholder-product.jpg"
    },
    {
      title: "Óculos de Proteção Ampla Visão",
      status: "sob_encomenda" as const,
      bullets: ["CA 54321", "Lente anti-embaçante", "Proteção UV"],
      image: "/placeholder-product.jpg"
    }
  ],
  // ... more categories would be populated here
};

// Generate items for other categories (simplified for demo)
const generateItems = (categoryId: string, categoryName: string) => [
  {
    title: `Item Premium ${categoryName} #1`,
    status: "estoque" as const,
    bullets: ["Especificação técnica 1", "Certificação internacional", "Garantia estendida"],
    image: "/placeholder-product.jpg"
  },
  {
    title: `Item Profissional ${categoryName} #2`,
    status: "sob_encomenda" as const,
    bullets: ["Alta durabilidade", "Tecnologia avançada", "Suporte técnico"],
    image: "/placeholder-product.jpg"
  },
  {
    title: `Item Industrial ${categoryName} #3`,
    status: "estoque" as const,
    bullets: ["Uso industrial", "Certificado de qualidade", "Pronta entrega"],
    image: "/placeholder-product.jpg"
  }
];

// Populate remaining categories
categories.forEach(cat => {
  if (!catalogItems[cat.id as keyof typeof catalogItems]) {
    catalogItems[cat.id as keyof typeof catalogItems] = generateItems(cat.id, cat.name);
  }
});

const getStatusConfig = (status: string) => {
  switch (status) {
    case "estoque":
      return { label: "Em estoque", variant: "default" as const, color: "bg-green-100 text-green-800" };
    case "sob_encomenda":
      return { label: "Sob encomenda", variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" };
    case "indisponivel":
      return { label: "Indisponível", variant: "destructive" as const, color: "bg-red-100 text-red-800" };
    default:
      return { label: "Consultar", variant: "outline" as const, color: "bg-gray-100 text-gray-800" };
  }
};

export default function Catalog() {
  const [activeCategory, setActiveCategory] = useState<string>("");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Catálogo — encontre por categoria"
        subtitle="Mais de 10.000 itens organizados para você encontrar exatamente o que precisa. Solicite orçamentos direto pelo WhatsApp."
        primaryCTA="Pedir orçamento"
        secondaryCTA="Falar com especialista"
        onSecondaryCTA={() => openWhatsApp({ context: "Gostaria de falar com um especialista sobre produtos" })}
      />

      {/* Category Navigation */}
      <CategoryChips 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryClick={setActiveCategory}
      />

      {/* Catalog Content */}
      <div className="py-12">
        {categories.map((category) => (
          <section key={category.id} id={category.id} className="mb-20">
            <div className="container-custom">
              <div className="flex items-center space-x-3 mb-8">
                <span className="text-3xl">{category.icon}</span>
                <h2 className="text-3xl font-bold text-foreground">{category.name}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {catalogItems[category.id as keyof typeof catalogItems]?.map((item, index) => {
                  const statusConfig = getStatusConfig(item.status);
                  
                  return (
                    <Card key={index} className="overflow-hidden hover-lift border-none shadow-card">
                      {/* Product Image */}
                      <div className="aspect-[4/3] bg-secondary flex items-center justify-center">
                        <Package className="w-16 h-16 text-muted-foreground" />
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-lg text-foreground leading-tight flex-1">
                            {item.title}
                          </h3>
                          <Badge className={`ml-2 ${statusConfig.color} border-none`}>
                            {statusConfig.label}
                          </Badge>
                        </div>
                        
                        <ul className="space-y-1 mb-6">
                          {item.bullets.map((bullet, bulletIndex) => (
                            <li key={bulletIndex} className="text-sm text-muted-foreground flex items-start">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                        
                        <Button
                          onClick={() => openWhatsApp({ item: item.title })}
                          className="w-full"
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
        ))}
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