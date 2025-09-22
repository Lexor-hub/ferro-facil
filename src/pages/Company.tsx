import { MessageCircle, Phone, ChevronRight, Cog, Shield, Zap, Target, Building2, Wrench, MapPin, Car, Users, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import HeroSection from "@/components/HeroSection";
import { openWhatsApp } from "@/lib/whatsapp";
import { Link } from "react-router-dom";
import MachineCarousel from "@/components/MachineCarousel";
import STimeline from "@/components/STimeline";
import { useCompanySections } from "@/hooks/useCompanySections";

export default function Company() {
  const { sections, loading, getStructureSections, getSectionByKey } = useCompanySections();

  // Get structure sections (3 cards)
  const structureSections = getStructureSections();

  // Get visit store section
  const visitStoreSection = getSectionByKey('visite_loja');

  // Fallback data
  const fallbackStructure = [
    {
      title: 'Estrutura de Ponta',
      description: 'Instalações modernas com showroom, área técnica e centro de distribuição integrados para atendimento completo.',
      image_url: 'https://placehold.co/600x400/174A8B/FFFFFF/png?text=Fachada+Moderna',
      alt_text: 'Fachada moderna da loja Grupo Soares',
      icon: Building2
    },
    {
      title: 'Estacionamento Próprio e Gratuito',
      description: 'Amplo estacionamento para clientes com acesso facilitado para carga e descarga, sem custo adicional.',
      image_url: 'https://placehold.co/600x400/174A8B/FFFFFF/png?text=Estacionamento',
      alt_text: 'Estacionamento amplo e gratuito do Grupo Soares',
      icon: Car
    },
    {
      title: 'Atendimento Especializado',
      description: 'Equipe técnica com conhecimento profundo em aplicações industriais e materiais de construção.',
      image_url: 'https://placehold.co/600x400/174A8B/FFFFFF/png?text=Atendimento',
      alt_text: 'Equipe de atendimento especializado do Grupo Soares',
      icon: Users
    }
  ];

  const fallbackVisitStore = {
    image_url: 'https://placehold.co/800x600/174A8B/FFFFFF/png?text=Fachada+Grupo+Soares',
    alt_text: 'Fachada da loja Grupo Soares com estacionamento'
  };

  // Use data from Supabase or fallback
  const displayStructure = structureSections.length >= 3 ?
    structureSections.slice(0, 3).map((section, index) => ({
      title: section.title,
      description: section.description || '',
      image_url: section.image_url || fallbackStructure[index]?.image_url,
      alt_text: section.alt_text || fallbackStructure[index]?.alt_text,
      icon: fallbackStructure[index]?.icon || Building2
    })) : fallbackStructure;

  const displayVisitStore = visitStoreSection ? {
    image_url: visitStoreSection.image_url || fallbackVisitStore.image_url,
    alt_text: visitStoreSection.alt_text || fallbackVisitStore.alt_text
  } : fallbackVisitStore;

  return (
    <div className="min-h-screen">
      {/* 1. Hero - Quem somos (H1 único) */}
      <HeroSection
        title="Quem somos"
        subtitle="A Loja Ferro & Aço é a operação de distribuição do Grupo Soares — extensão direta da Ferramentaria Soares trazendo toda a credibilidade e cuidado com nosso clientes. Com estrutura de ponta, estacionamento próprio e gratuito, e atendimento especializado, somos o parceiro ideal para sua empresa"
        primaryCTA="Solicitar orçamento"
        secondaryCTA="Falar conosco"
        onSecondaryCTA={() => openWhatsApp({ context: "Gostaria de conhecer mais sobre o Grupo Soares" })}
        className="bg-blue-900"
      />

      {/* 2. Nossa estrutura premium */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Estrutura Pronta para Atendimento de Excelência
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Oferecemos uma experiência completa com instalações modernas e facilidades exclusivas para nossos clientes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {displayStructure.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <Card key={index} className="p-6 hover-lift border-none shadow-card bg-white overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-premium rounded-lg mb-6 overflow-hidden">
                      <img
                        src={section.image_url}
                        alt={section.alt_text}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-12 h-12 bg-gradient-premium rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-3 text-foreground">{section.title}</h3>
                    <p className="text-muted-foreground">{section.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
        </div>
      </section>

      {/* 3. O que entregamos */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              O que entregamos
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 hover-lift border-none shadow-card">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-premium rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-3 text-foreground">Aços e perfis</h3>
                <p className="text-muted-foreground text-sm">chapas, barras, tubos e acessórios.</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover-lift border-none shadow-card">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-premium rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-3 text-foreground">EPIs homologados</h3>
                <p className="text-muted-foreground text-sm">proteção com orientação de uso.</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover-lift border-none shadow-card">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-premium rounded-lg flex items-center justify-center mb-4">
                  <Cog className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-3 text-foreground">Consumíveis de produção</h3>
                <p className="text-muted-foreground text-sm">abrasivos, corte, furação, solda.</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover-lift border-none shadow-card">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-premium rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-3 text-foreground">Insumos recorrentes</h3>
                <p className="text-muted-foreground text-sm">reposição ágil para não parar a operação.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. Parque tecnológico & processos */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Tecnologia e Processo
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-muted-foreground mb-8">
                Investimos continuamente nas melhores máquinas e tecnologias do mercado para elevar padrão, produtividade e prazos — de corte/preparação a medição, conferência e rastreabilidade.
              </p>
            </div>
          </div>

          {/* Machine Carousel */}
          <div className="mb-12">
            <MachineCarousel carouselKey="tecnologia-processo" />
          </div>

          {/* Process bullets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          </div>
        </div>
      </section>

      {/* 5. Como trabalhamos */}
      <section className="py-20 bg-gradient-subtle relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23174A8B' fill-opacity='0.4'%3E%3Ccircle cx='5' cy='5' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            width: '100%',
            height: '100%'
          }} />
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-premium rounded-full mb-6">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-gradient-premium rounded-full"></div>
              </div>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Como trabalhamos
            </h2>
            <div className="w-24 h-1 bg-gradient-primary mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Processos pensados para simplificar sua operação com máxima eficiência
            </p>
          </div>
          
          <div className="relative">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-primary opacity-5 rounded-3xl blur-3xl"></div>
            
            {/* Timeline container */}
            <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-white/20 shadow-card">
              <STimeline />
            </div>
          </div>
          
          {/* Bottom accent */}
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Diferenciais */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Nossos Diferenciais Competitivos
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Vantagens exclusivas que fazem do Grupo Soares a escolha certa para sua empresa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover-lift border-none shadow-card bg-white">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Curadoria Especializada</h3>
                <p className="text-muted-foreground">Selecionamos produtos com a melhor relação desempenho/custo para sua aplicação específica.</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover-lift border-none shadow-card bg-white">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Atendimento Consultivo</h3>
                <p className="text-muted-foreground">Consultores técnicos que entendem sua necessidade e garantem o pedido certo de primeira.</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover-lift border-none shadow-card bg-white">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Logística Eficiente</h3>
                <p className="text-muted-foreground">Lead time reduzido com sistema de picking e expedição otimizados para entregas pontuais.</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover-lift border-none shadow-card bg-white">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Rastreabilidade Total</h3>
                <p className="text-muted-foreground">Documentação completa e rastreabilidade de todos os itens críticos para sua segurança.</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover-lift border-none shadow-card bg-white">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-4">
                  <Wrench className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">EPIs Certificados</h3>
                <p className="text-muted-foreground">Equipamentos de proteção em total conformidade com as NRs vigentes e certificações atualizadas.</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover-lift border-none shadow-card bg-white">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-premium rounded-lg flex items-center justify-center mb-4">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Facilidade de Acesso</h3>
                <p className="text-muted-foreground">Estacionamento próprio e gratuito com área dedicada para carga e descarga de materiais.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Visite nossa loja - Nova seção */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Visite Nossa Loja
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Conheça pessoalmente nossa estrutura moderna, com estacionamento próprio e gratuito. Nossa equipe está pronta para recebê-lo e apresentar as melhores soluções para seu negócio.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-6 h-6 text-gradient-premium flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Rua Prof. Armando Lino Antunes, 251</p>
                    <p className="text-muted-foreground">Mairinque - SP</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-gradient-premium flex-shrink-0" />
                  <div>
                    <p className="font-medium">Segunda a Sexta: 8h às 18h</p>
                    <p className="text-muted-foreground">Sábado: 8h às 13h</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Car className="w-6 h-6 text-gradient-premium flex-shrink-0" />
                  <p className="font-medium">Estacionamento próprio e gratuito</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => window.open('https://maps.google.com/maps?q=R.+Prof.+Armando+Lino+Antunes+251+Mairinque+SP', '_blank')}
                  variant="outline"
                  size="lg"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Traçar rota
                </Button>
                <Button
                  onClick={() => openWhatsApp({ context: "Gostaria de agendar uma visita à loja" })}
                  variant="default"
                  size="lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Agendar visita
                </Button>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-card">
              <div className="aspect-[4/3] rounded-xl overflow-hidden">
                <img
                  src={displayVisitStore.image_url}
                  alt={displayVisitStore.alt_text}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Fale com a gente (CTA Final) */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Fale com a gente
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Precisa de especificação, disponibilidade ou prazo? Nosso time responde rápido.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.open("https://wa.me/5511920855739", "_blank")}
              variant="whatsapp"
              size="xl"
              className="font-semibold"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Falar no WhatsApp
            </Button>
            <Link to="/contato">
              <Button
                variant="accent"
                size="xl"
                className="font-semibold w-full sm:w-auto"
              >
                <Phone className="w-5 h-5 mr-2" />
                Falar com um especialista
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
