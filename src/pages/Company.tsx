import { Award, Users, TrendingUp, Shield, CheckCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HeroSection from "@/components/HeroSection";
import { openWhatsApp } from "@/lib/whatsapp";

const companyValues = [
  {
    title: "20+ anos de experiência",
    description: "Mais de duas décadas atendendo o mercado industrial com excelência",
    icon: Calendar
  },
  {
    title: "Foco na indústria e obras",
    description: "Especialização em materiais e soluções para projetos industriais",
    icon: Award
  },
  {
    title: "Serviço que resolve",
    description: "Não apenas vendemos produtos, resolvemos problemas e desafios",
    icon: Shield
  }
];

const companyNumbers = [
  { number: "+200", label: "Clientes ativos", description: "empresas confiam em nossos serviços" },
  { number: "+10k", label: "Itens em estoque", description: "produtos disponíveis para pronta entrega" },
  { number: "4-6h", label: "Janela de entrega", description: "prazo médio para entregas expressas" },
  { number: "20", label: "Cidades atendidas", description: "em São Paulo e região metropolitana" }
];

const workingMethod = [
  {
    title: "Requisição simples",
    description: "Processo descomplicado para solicitar orçamentos e fazer pedidos",
    icon: "📝"
  },
  {
    title: "Seleção & conferência",
    description: "Cada item é selecionado e conferido antes da expedição",
    icon: "✅"
  },
  {
    title: "Corte & preparação",
    description: "Serviços de corte e preparação conforme suas especificações",
    icon: "🔧"
  },
  {
    title: "Logística controlada",
    description: "Entrega com frota própria e rastreamento em tempo real",
    icon: "🚛"
  }
];

const clientLogos = [
  "Petrobras", "Vale", "CSN", "Gerdau", "Braskem", "Suzano",
  "Klabin", "Fibria", "Sabesp", "CPFL", "Elektro", "AES"
];

const brandLogos = [
  "Makita", "Bosch", "DeWalt", "Stanley", "Vonder", "Tramontina",
  "3M", "Honeywell", "MSA", "Carbografite", "Esab", "White Martins"
];

const bestPractices = [
  {
    title: "Nota conferida",
    description: "Processo rigoroso de conferência antes da expedição para evitar erros",
    icon: CheckCircle
  },
  {
    title: "Processos auditáveis",
    description: "Documentação completa e rastreabilidade de todos os processos",
    icon: Shield
  },
  {
    title: "Segurança de EPI/NRs",
    description: "Todos os EPIs certificados e em conformidade com as NRs vigentes",
    icon: Award
  }
];

const team = [
  {
    name: "Edson Luiz Soares",
    role: "Fundador e Diretor Técnico",
    photo: "ES"
  },
  {
    name: "Maria Soares Silva",
    role: "Diretora Comercial",
    photo: "MS"
  },
  {
    name: "Carlos Eduardo Santos",
    role: "Gerente de Logística", 
    photo: "CS"
  },
  {
    name: "Ana Paula Oliveira",
    role: "Coordenadora Técnica",
    photo: "AP"
  }
];

export default function Company() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Tradição com mentalidade moderna"
        subtitle="Mais de 20 anos combinando experiência sólida com tecnologia e processos modernos para atender suas necessidades industriais."
        primaryCTA="Conhecer nossa história"
        secondaryCTA="Falar conosco"
        onSecondaryCTA={() => openWhatsApp({ context: "Gostaria de conhecer mais sobre o Grupo Soares" })}
      />

      {/* O Grupo Soares */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              O Grupo Soares
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Construímos nossa reputação baseada em três pilares fundamentais
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {companyValues.map((value, index) => (
              <Card key={index} className="text-center p-8 hover-lift border-none shadow-card">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-4 text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Nossos números */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Nossos números
            </h2>
            <p className="text-xl text-muted-foreground">
              Dados que refletem nosso compromisso com a excelência
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyNumbers.map((stat, index) => (
              <Card key={index} className="text-center p-8 hover-lift border-none shadow-card bg-white">
                <CardContent className="p-0">
                  <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="font-semibold text-lg text-foreground mb-2">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Nosso jeito de trabalhar */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Nosso jeito de trabalhar
            </h2>
            <p className="text-xl text-muted-foreground">
              Processos pensados para simplificar sua operação
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workingMethod.map((method, index) => (
              <Card key={index} className="text-center p-6 hover-lift border-none shadow-card">
                <CardContent className="p-0">
                  <div className="text-4xl mb-4">{method.icon}</div>
                  <h3 className="font-semibold text-lg mb-3 text-foreground">{method.title}</h3>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Alguns clientes atendidos */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Alguns clientes atendidos
            </h2>
            <p className="text-xl text-muted-foreground">
              Empresas que confiam em nossos serviços
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {clientLogos.map((client, index) => (
              <Card key={index} className="p-6 flex items-center justify-center hover-lift border-none shadow-card bg-white min-h-[100px]">
                <CardContent className="p-0">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-xs">{client.substring(0, 2)}</span>
                    </div>
                    <div className="text-xs font-medium text-foreground">{client}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Marcas que trabalhamos */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Marcas que trabalhamos
            </h2>
            <p className="text-xl text-muted-foreground">
              Parceiros de qualidade reconhecida no mercado
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {brandLogos.map((brand, index) => (
              <Card key={index} className="p-6 flex items-center justify-center hover-lift border-none shadow-card min-h-[100px]">
                <CardContent className="p-0">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <span className="text-accent font-bold text-xs">{brand.substring(0, 2)}</span>
                    </div>
                    <div className="text-xs font-medium text-foreground">{brand}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Boas práticas e confiabilidade */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Boas práticas e confiabilidade
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprometimento com qualidade e segurança em todos os processos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bestPractices.map((practice, index) => (
              <Card key={index} className="text-center p-8 hover-lift border-none shadow-card bg-white">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <practice.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-xl mb-4 text-foreground">{practice.title}</h3>
                  <p className="text-muted-foreground">{practice.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gente que resolve */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Gente que resolve
            </h2>
            <p className="text-xl text-muted-foreground">
              Nossa equipe de liderança está sempre disponível para você
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center p-8 hover-lift border-none shadow-card">
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white font-bold text-xl">{member.photo}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{member.name}</h3>
                  <p className="text-muted-foreground text-sm">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button
              onClick={() => openWhatsApp({ context: "Gostaria de falar com a diretoria" })}
              variant="outline"
              size="lg"
            >
              <Users className="w-5 h-5 mr-2" />
              Falar com a equipe
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Conte com a Loja para sua obra parar
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Vamos conversar sobre como podemos ajudar seu projeto
          </p>
          <Button
            onClick={() => openWhatsApp({ context: "Gostaria de conhecer como vocês podem ajudar meu projeto" })}
            variant="accent"
            size="xl"
            className="font-semibold"
          >
            Vamos conversar
          </Button>
        </div>
      </section>
    </div>
  );
}