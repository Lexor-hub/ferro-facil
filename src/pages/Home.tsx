import { ChevronDown, CheckCircle, Truck, Shield, Clock, Settings, ArrowRight, Star, MapPin, Phone } from "lucide-react";
import MapboxMap from "@/components/MapboxMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import HeroCarousel from "@/components/HeroCarousel";
import WeeklyOffers from "@/components/WeeklyOffers";
import { openWhatsApp } from "@/lib/whatsapp";
import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

// Import das imagens
import ferroAcoImg from "@/assets/ferro-aco.jpg";
import episImg from "@/assets/epis.jpg";
import consumiveisImg from "@/assets/consumiveis-tecnicos.jpg";
import insumosImg from "@/assets/insumos-industriais.jpg";
import ferramentasEletricasImg from "@/assets/ferramentas-eletricas.jpg";
import ferramentasBateriaImg from "@/assets/ferramentas-bateria.jpg";
import ferramentasManuaisImg from "@/assets/ferramentas-manuais.jpg";
import soldaImg from "@/assets/solda-acessorios.jpg";

const categories = [
  { 
    name: "Ferro & Aço", 
    href: "/catalogo#ferro-aco", 
    icon: "🔧",
    image: ferroAcoImg,
    description: "Barras, chapas, tubos e perfis. Corte sob medida disponível."
  },
  { 
    name: "EPIs", 
    href: "/catalogo#epis", 
    icon: "🦺",
    image: episImg,
    description: "Equipamentos certificados para proteção individual completa."
  },
  { 
    name: "Consumíveis Técnicos", 
    href: "/catalogo#consumiveis-tecnicos", 
    icon: "⚙️",
    image: consumiveisImg,
    description: "Materiais técnicos para manutenção e produção industrial."
  },
  { 
    name: "Insumos Industriais", 
    href: "/catalogo#insumos-industriais", 
    icon: "🏭",
    image: insumosImg,
    description: "Materiais básicos e especializados para processos industriais."
  },
  { 
    name: "Ferramentas Elétricas", 
    href: "/catalogo#ferramentas-eletricas", 
    icon: "⚡",
    image: ferramentasEletricasImg,
    description: "Equipamentos elétricos profissionais de alta performance."
  },
  { 
    name: "Ferramentas à Bateria", 
    href: "/catalogo#ferramentas-bateria", 
    icon: "🔋",
    image: ferramentasBateriaImg,
    description: "Portabilidade e potência para trabalhos sem limitações."
  },
  { 
    name: "Ferramentas Manuais", 
    href: "/catalogo#ferramentas-manuais", 
    icon: "🔨",
    image: ferramentasManuaisImg,
    description: "Precisão e durabilidade para o trabalho artesanal."
  },
  { 
    name: "Solda & Acessórios", 
    href: "/catalogo#solda-acessorios", 
    icon: "🔥",
    image: soldaImg,
    description: "Eletrodos, gases e equipamentos para soldagem profissional."
  }
];

const problems = [
  { icon: CheckCircle, title: "Ordem errada", description: "Não ter que refazer pedidos por divergências ou falta de clareza" },
  { icon: Truck, title: "Entrega cruzada", description: "Receber o produto certo, no local certo, no prazo combinado" },
  { icon: Clock, title: "Demora sem retorno", description: "Ter transparência total sobre prazos e status do pedido" },
  { icon: Shield, title: "Falta de qualidade", description: "Produtos certificados e de marcas reconhecidas no mercado" }
];

const solutions = [
  { icon: Shield, title: "Material de qualidade", description: "Fontes confiáveis." },
  { icon: CheckCircle, title: "Pessoal qualificado", description: "Atendimento consultivo." },
  { icon: Settings, title: "Corte sob medida", description: "Personalização." },
  { icon: Truck, title: "Frota própria", description: "Logística rápida." },
  { icon: Clock, title: "Preço competitivo", description: "Custo total menor." },
  { icon: ArrowRight, title: "Agilidade", description: "Entrega em 4h." }
];

const testimonials = [
  {
    quote: "Trabalhar com o Grupo Soares transformou nossa operação. Nunca mais tivemos problemas com prazos ou qualidade.",
    author: "Carlos Silva",
    company: "Metalúrgica Industrial",
    avatar: "CS"
  },
  {
    quote: "A logística própria faz toda a diferença. Sabemos exatamente quando nossos materiais vão chegar.",
    author: "Maria Santos",
    company: "Construtora Horizonte",
    avatar: "MS"
  },
  {
    quote: "O atendimento técnico é excepcional. Sempre encontram a solução certa para nossos desafios.",
    author: "João Pereira",
    company: "Indústria Brasileira",
    avatar: "JP"
  }
];

const scrollToCategories = () => {
  document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
};

const fleetImages = [
  {
    src: "/frota-1.jpg",
    alt: "Frota de caminhões Grupo Soares estacionada no pátio da empresa"
  },
  {
    src: "/frota-2.jpg", 
    alt: "Caminhões com identidade visual Soares para entrega de materiais industriais"
  },
  {
    src: "/frota-3.jpg",
    alt: "Equipamentos de carga e frota logística da empresa Grupo Soares"
  }
];

export default function Home() {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );
  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Ofertas da Semana */}
      <WeeklyOffers />

      {/* Muitas soluções em um lugar só - Simplified White Section */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 heading-premium">
              Muitas soluções em um lugar só
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Mais que um fornecedor, somos seu parceiro para resolver desafios industriais.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((solution, index) => (
              <Card key={index} className="p-6 text-center hover-lift shadow-card">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gradient-premium rounded-full flex items-center justify-center mx-auto mb-4">
                    <solution.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{solution.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{solution.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Encontre rápido o que precisa - Enhanced with Premium Cards */}
      <section id="categories" className="py-20 bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold heading-premium mb-4">
              Encontre rápido o que precisa
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Navegue pelas nossas categorias ou fale direto com nossos especialistas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.href}
                className="group"
              >
                <Card className="h-full overflow-hidden card-gold-accent group-hover:shadow-gold group-hover:scale-[1.02] transition-all duration-300 hover-lift">
                  <div className="relative">
                    {/* Background Image */}
                    <div className="h-32 relative overflow-hidden">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      
                      {/* Icon Overlay */}
                      <div className="absolute bottom-3 left-3">
                        <div className="text-3xl filter drop-shadow-lg">{category.icon}</div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <CardContent className="p-6 bg-white">
                      <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-gradient transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-sm font-medium">Ver produtos</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button
              onClick={() => openWhatsApp({ context: "Gostaria de falar com um especialista sobre produtos" })}
              variant="whatsapp"
              size="lg"
              className="shadow-premium"
            >
              Falar com especialista
            </Button>
          </div>
        </div>
      </section>

      {/* Logística própria */}
      <section className="py-20 bg-gradient-premium text-white relative">
        {/* Top Wave */}
        <div className="absolute top-0 left-0 right-0">
          <svg className="w-full h-16 lg:h-24" viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 0L50 15C100 30 200 60 300 75C400 90 500 90 600 82.5C700 75 800 60 900 52.5C1000 45 1100 45 1150 45L1200 45V0H1150C1100 0 1000 0 900 0C800 0 700 0 600 0C500 0 400 0 300 0C200 0 100 0 50 0H0V0Z" fill="currentColor" className="text-background"/>
          </svg>
        </div>
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Logística própria, sua garantia de confiabilidade
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0" />
                  <span>Controle total sobre entregas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0" />
                  <span>Equipe especializada em manuseio</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0" />
                  <span>Flexibilidade de horários</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0" />
                  <span>Cobertura na Grande São Paulo</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0" />
                  <span>Carga e descarga incluídas</span>
                </div>
              </div>
              <Button
                onClick={() => openWhatsApp({ context: "Gostaria de saber mais sobre a logística" })}
                variant="outline" 
                size="lg" 
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
              >
                Falar sobre logística
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <div className="relative">
              <Carousel
                plugins={[plugin.current]}
                className="w-full max-w-lg mx-auto"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
              >
                <CarouselContent>
                  {fleetImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                        <div className="aspect-video rounded-xl overflow-hidden">
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </div>
        
      </section>

      {/* Mensagem do fundador - Premium Section */}
      <section className="py-20 bg-gradient-premium text-white relative">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-gold shadow-gold flex items-center justify-center mx-auto mb-6">
                <span className="text-black font-bold text-2xl">ES</span>
              </div>
              <blockquote className="text-2xl lg:text-3xl font-medium mb-6 italic">
                "Construímos o Grupo Soares com a certeza de que cada cliente merece um atendimento excepcional. 
                Não é apenas sobre vender produtos, é sobre resolver problemas e criar parcerias duradouras."
              </blockquote>
              <cite className="text-lg text-white/80">
                <strong className="text-gradient-gold">Edson Luiz Soares</strong><br />
                Fundador e Diretor Técnico
              </cite>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos - Enhanced Premium */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold heading-premium mb-4">
              Casos de sucesso e depoimentos
            </h2>
            <p className="text-xl text-muted-foreground">
              Veja o que nossos clientes falam sobre nossa parceria
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-gold-accent p-6 shadow-premium hover-lift">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mb-6 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center shadow-gold">
                      <span className="text-black font-semibold text-sm">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Estamos aqui */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Estamos aqui
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div className="text-muted-foreground">
                    <div>R. Prof. Armando Lino Antunes, 251</div>
                    <div>DISTRITO INDUSTRIAL, Mairinque - SP, CEP 18120-000</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">(11) 99988-7766</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => window.open('https://maps.google.com/maps?q=R.+Prof.+Armando+Lino+Antunes+251+Mairinque+SP', '_blank')}
                  variant="outline"
                  size="lg"
                >
                  Traçar rota
                </Button>
                <Button
                  onClick={() => openWhatsApp({ context: "Gostaria de visitar a loja" })}
                  variant="whatsapp"
                  size="lg"
                >
                  WhatsApp
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl p-4 shadow-card">
                <MapboxMap />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-premium text-white relative">
        {/* Top Wave */}
        <div className="absolute top-0 left-0 right-0">
          <svg className="w-full h-16 lg:h-24" viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 0L50 15C100 30 200 60 300 75C400 90 500 90 600 82.5C700 75 800 60 900 52.5C1000 45 1100 45 1150 45L1200 45V0H1150C1100 0 1000 0 900 0C800 0 700 0 600 0C500 0 400 0 300 0C200 0 100 0 50 0H0V0Z" fill="currentColor" className="text-background"/>
          </svg>
        </div>
        
        <div className="container-custom text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Precisa de um orçamento ou quer tirar dúvidas?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Fale com nossos especialistas via WhatsApp
          </p>
          <Button
            onClick={() => openWhatsApp({ context: "Gostaria de solicitar um orçamento" })}
            variant="whatsapp"
            size="xl"
            className="font-semibold"
          >
            Chamar no WhatsApp
          </Button>
        </div>
      </section>
    </div>
  );
}