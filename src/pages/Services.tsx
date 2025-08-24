import { CheckCircle, Settings, Truck, Users, Clock, AlertTriangle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import HeroSection from "@/components/HeroSection";
import { openWhatsApp } from "@/lib/whatsapp";

const cuttingServices = [
  "Corte em chapas de até 20mm",
  "Corte plasma para formas complexas", 
  "Dobra e conformação",
  "Furação e usinagem básica"
];

const materials = [
  { name: "Aço carbono", formats: ["Chapa", "Perfil", "Barra"] },
  { name: "Aço inox", formats: ["Chapa", "Tubo", "Barra"] },
  { name: "Alumínio", formats: ["Chapa", "Perfil", "Tubo"] }
];

const expeditionChecks = [
  "Conferência por código de barras",
  "Verificação de medidas e especificações",
  "Embalagem adequada para transporte",
  "Etiquetagem e identificação completa"
];

const technicalWhen = [
  "Projetos com especificações técnicas complexas",
  "Seleção de materiais para aplicações específicas",
  "Adequação às normas técnicas (ABNT, ASTM, etc.)",
  "Suporte em dimensionamento estrutural"
];

const technicalWhat = [
  "Análise técnica do projeto",
  "Sugestões de otimização de materiais",
  "Documentação técnica completa",
  "Acompanhamento da aplicação"
];

const emergencyServices = [
  { title: "Plantão técnico", description: "Suporte especializado 24h", phone: "(11) 99988-7766" },
  { title: "Entrega expressa", description: "Produtos críticos em até 4h", phone: "(11) 99988-7767" },
  { title: "Suporte urgente", description: "Resolução de problemas críticos", phone: "(11) 99988-7768" }
];

const processSteps = [
  { 
    title: "Fale conosco", 
    description: "Entre em contato via WhatsApp ou telefone com suas necessidades" 
  },
  { 
    title: "Receba o orçamento", 
    description: "Nossa equipe técnica elabora a proposta com prazos e especificações" 
  },
  { 
    title: "Acompanhe a execução", 
    description: "Receba atualizações sobre o andamento até a entrega final" 
  }
];

const whenToUse = {
  yes: [
    "Projetos que exigem precisão dimensional",
    "Necessidade de documentação técnica",
    "Materiais com especificações rígidas",
    "Prazos críticos de entrega"
  ],
  no: [
    "Compras simples de produtos padrão",
    "Materiais sem especificações técnicas",
    "Projetos sem urgência",
    "Aplicações não críticas"
  ]
};

const faqs = [
  {
    question: "Qual o prazo para serviços de corte e preparação?",
    answer: "O prazo varia conforme a complexidade, mas normalmente executamos em 1 a 3 dias úteis. Para urgências, temos serviço expresso em até 24h com taxa adicional."
  },
  {
    question: "Vocês fazem corte de materiais que o cliente fornece?",
    answer: "Sim, prestamos serviços de corte e preparação em materiais fornecidos pelo cliente. É necessário verificar as condições do material e compatibilidade com nossos equipamentos."
  },
  {
    question: "O atendimento técnico tem custo adicional?",
    answer: "A consultoria técnica básica é gratuita para nossos clientes. Serviços especializados como projetos e cálculos estruturais podem ter custo adicional, sempre informado previamente."
  },
  {
    question: "Existe garantia nos serviços prestados?",
    answer: "Sim, todos os nossos serviços têm garantia. Cortes e preparações têm garantia dimensional, e o atendimento técnico inclui suporte pós-entrega."
  }
];

export default function Services() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Serviços que aceleram sua obra e manutenção"
        subtitle="Além de fornecer materiais, preparamos, cortamos e entregamos exatamente como você precisa. Atendimento técnico especializado incluído."
        primaryCTA="Pedir orçamento"
        secondaryCTA="Falar com técnico"
        onSecondaryCTA={() => openWhatsApp({ service: "atendimento técnico" })}
      />

      {/* Corte e preparação */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Settings className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Corte e preparação — sob medida e conteúdo</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-foreground">O que fazemos:</h3>
                  <ul className="space-y-2">
                    {cuttingServices.map((service, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-muted-foreground">{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button
                  onClick={() => openWhatsApp({ service: "corte e preparação" })}
                  variant="default"
                  size="lg"
                >
                  Agendar serviço
                </Button>
              </div>
            </div>
            
            <div>
              <Card className="shadow-card border-none">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 text-foreground">Materiais vs. Formatos</h3>
                  <div className="space-y-4">
                    {materials.map((material, index) => (
                      <div key={index} className="pb-4 border-b border-border last:border-b-0 last:pb-0">
                        <div className="font-medium text-foreground mb-2">{material.name}</div>
                        <div className="flex flex-wrap gap-2">
                          {material.formats.map((format, formatIndex) => (
                            <span key={formatIndex} className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full">
                              {format}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Seleção e expedição */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Truck className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Seleção e expedição — pronto certo, do primeiro ao último item</h2>
              </div>
              
              <ul className="space-y-3 mb-8">
                {expeditionChecks.map((check, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-muted-foreground">{check}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                onClick={() => openWhatsApp({ service: "seleção e expedição" })}
                variant="default"
                size="lg"
              >
                Solicitar orçamento
              </Button>
            </div>
            
            <div>
              <Card className="shadow-card border-none bg-white">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="font-medium text-green-800">Pronto</span>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <span className="font-medium text-yellow-800">Em conferência</span>
                      <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium text-blue-800">Em rota</span>
                      <Truck className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Atendimento técnico */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="flex items-center space-x-3 mb-12">
            <Users className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Atendimento técnico — escolha certa com autorização</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="font-semibold text-xl mb-6 text-foreground">Quando usar:</h3>
              <ul className="space-y-3">
                {technicalWhen.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-xl mb-6 text-foreground">O que entregamos:</h3>
              <ul className="space-y-3">
                {technicalWhat.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Faixa Atendimento 24h */}
      <section className="py-16 bg-accent text-accent-foreground">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Atendimento emergencial 24h</h2>
            <p className="text-xl opacity-90">Para situações críticas que não podem esperar</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {emergencyServices.map((service, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
                <CardContent className="p-6">
                  <Phone className="w-8 h-8 mx-auto mb-4 text-white" />
                  <h3 className="font-semibold text-lg mb-2 text-white">{service.title}</h3>
                  <p className="text-white/80 mb-4 text-sm">{service.description}</p>
                  <Button
                    onClick={() => window.open(`tel:${service.phone.replace(/\D/g, '')}`)}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/20 hover:border-white/50"
                  >
                    Chamar agora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Como funciona (3 passos simples)</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-xl mb-4 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button
              onClick={() => openWhatsApp({ context: "Gostaria de solicitar um serviço" })}
              variant="hero"
              size="lg"
            >
              Começar agora
            </Button>
          </div>
        </div>
      </section>

      {/* Quando usar nossos serviços */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Quando usar nossos serviços</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="shadow-card border-none bg-green-50">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <h3 className="font-semibold text-xl text-green-800">Recomendado para:</h3>
                </div>
                <ul className="space-y-3">
                  {whenToUse.yes.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-green-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="shadow-card border-none bg-red-50">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  <h3 className="font-semibold text-xl text-red-800">Não necessário para:</h3>
                </div>
                <ul className="space-y-3">
                  {whenToUse.no.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-red-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Perguntas frequentes</h2>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}