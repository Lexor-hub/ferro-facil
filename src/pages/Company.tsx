import { MessageCircle, Phone, ChevronRight, Cog, Shield, Zap, Target, Building2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HeroSection from "@/components/HeroSection";
import { openWhatsApp } from "@/lib/whatsapp";
import { Link } from "react-router-dom";
import MachineCarousel from "@/components/MachineCarousel";
import STimeline from "@/components/STimeline";

export default function Company() {
  return (
    <div className="min-h-screen">
      {/* 1. Hero - Quem somos (H1 único) */}
      <HeroSection
        title="Quem somos"
        subtitle="A Loja Ferro & Aço é a operação de distribuição do Grupo Soares — extensão direta da Ferramentaria Soares. Mantemos obra e indústria abastecidas com ferro & aço, EPIs, consumíveis e insumos industriais, com atendimento que entende aplicação e cronograma. Foco em pedido assertivo, processo simples e entrega pontual."
        primaryCTA="Solicitar orçamento"
        secondaryCTA="Falar conosco"
        onSecondaryCTA={() => openWhatsApp({ context: "Gostaria de conhecer mais sobre o Grupo Soares" })}
      />

      {/* 2. Nossa promessa em uma linha */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8">
              Nossa promessa em uma linha
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="text-2xl lg:text-3xl font-semibold text-gradient bg-gradient-primary bg-clip-text">
                Produto certo, do jeito certo, na hora certa.
              </div>
            </div>
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
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-3 text-foreground">Aços e perfis</h3>
                <p className="text-muted-foreground text-sm">chapas, barras, tubos e acessórios.</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover-lift border-none shadow-card">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-3 text-foreground">EPIs homologados</h3>
                <p className="text-muted-foreground text-sm">proteção com orientação de uso.</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover-lift border-none shadow-card">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Cog className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-3 text-foreground">Consumíveis de produção</h3>
                <p className="text-muted-foreground text-sm">abrasivos, corte, furação, solda.</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover-lift border-none shadow-card">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
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
              Parque tecnológico & processos
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-muted-foreground mb-8">
                Investimos continuamente nas melhores máquinas e tecnologias do mercado para elevar padrão, produtividade e prazos — de corte/preparação a medição, conferência e rastreabilidade.
              </p>
            </div>
          </div>

          {/* Machine Carousel */}
          <div className="mb-12">
            <MachineCarousel />
          </div>

          {/* Process bullets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
              </div>
              <p className="font-medium text-foreground">Corte e preparação sob medida</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
              </div>
              <p className="font-medium text-foreground">Medição e conferência com registro</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
              </div>
              <p className="font-medium text-foreground">Rastreabilidade por etiqueta/código</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
              </div>
              <p className="font-medium text-foreground">Sistemas de gestão do status do pedido</p>
            </div>
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
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
              Diferenciais
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover-lift border-none shadow-card bg-white">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-foreground font-medium">Curadoria com melhor desempenho/custo.</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover-lift border-none shadow-card bg-white">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-foreground font-medium">Atendimento consultivo para acertar de primeira.</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover-lift border-none shadow-card bg-white">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-foreground font-medium">Lead time curto com picking e expedição eficientes.</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover-lift border-none shadow-card bg-white">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-foreground font-medium">Rastreabilidade/documentação de itens críticos.</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover-lift border-none shadow-card bg-white md:col-span-2 lg:col-span-1">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-4">
                  <Wrench className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-foreground font-medium">EPIs em conformidade com as NRs vigentes.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 7. Quem atendemos */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Quem atendemos
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 hover-lift border-none shadow-card">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <p className="text-foreground font-medium mb-2">Construtoras e empreiteiras</p>
                <p className="text-muted-foreground text-sm">com cronogramas apertados.</p>
              </CardContent>
            </Card>

            <Card className="p-8 hover-lift border-none shadow-card">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Cog className="w-6 h-6 text-primary" />
                </div>
                <p className="text-foreground font-medium mb-2">Engenharia e manutenção industrial</p>
                <p className="text-muted-foreground text-sm">com compliance.</p>
              </CardContent>
            </Card>

            <Card className="p-8 hover-lift border-none shadow-card">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Wrench className="w-6 h-6 text-primary" />
                </div>
                <p className="text-foreground font-medium mb-2">Obras civis e montagens metálicas</p>
                <p className="text-muted-foreground text-sm">de alto giro.</p>
              </CardContent>
            </Card>

            <Card className="p-8 hover-lift border-none shadow-card">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <p className="text-foreground font-medium mb-2">Profissionais e serralherias</p>
                <p className="text-muted-foreground text-sm">com foco em qualidade e custo/benefício.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 8. Conheça nossas empresas */}
      <section id="empresas" className="py-20 bg-gradient-subtle">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Conheça nossas empresas
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Somos Grupo Soares. A Loja Ferro & Aço cuida da distribuição e reposição rápida; a Ferramentaria Soares é a base de fabricação e projetos sob medida.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 hover-lift border-none shadow-card bg-white">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mb-6">
                  <Wrench className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-4 text-foreground">Ferramentaria Soares</h3>
                <p className="text-muted-foreground mb-6">projetos, usinagem, corte e dobra.</p>
                <Link to="/ferramentaria-soares">
                  <Button variant="outline" className="w-full group">
                    Ver Ferramentaria
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="p-8 hover-lift border-none shadow-card bg-white">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mb-6">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-4 text-foreground">Loja Ferro & Aço</h3>
                <p className="text-muted-foreground mb-6">catálogo e reposição ágil.</p>
                <Link to="/catalogo">
                  <Button variant="outline" className="w-full group">
                    Ver Catálogo
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
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
              onClick={() => window.open("https://wa.me/5511999887766", "_blank")}
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