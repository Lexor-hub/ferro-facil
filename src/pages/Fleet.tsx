import { MapPin, Clock, Truck, CheckCircle, Route, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import HeroSection from "@/components/HeroSection";
import { openWhatsApp } from "@/lib/whatsapp";

const deliveryFeatures = [
  "Janelas de entrega de 2 horas",
  "Roteirização otimizada",
  "Conferência antes da partida",
  "Comprovantes digitais"
];

const deliveryRegions = [
  "São Paulo - Capital e Grande São Paulo",
  "ABC Paulista - Santo André, São Bernardo, São Caetano",
  "Campinas e região metropolitana",
  "São José dos Campos e Vale do Paraíba",
  "Sorocaba e região",
  "Santos e Baixada Santista"
];

const deliveryTypes = [
  {
    title: "Entrega expressa",
    description: "Para materiais urgentes",
    sla: "4 a 8 horas",
    icon: "⚡"
  },
  {
    title: "Entrega programada",
    description: "Agendamento com antecedência",
    sla: "1 a 3 dias úteis",
    icon: "📅"
  },
  {
    title: "Entrega dedicada",
    description: "Exclusiva para grandes volumes",
    sla: "Sob consulta",
    icon: "🚛"
  }
];

const transparencyFeatures = [
  {
    title: "Rastreamento",
    description: "Acompanhe seu pedido em tempo real",
    icon: Route
  },
  {
    title: "Canal direto",
    description: "Fale direto com o motorista",
    icon: Truck
  },
  {
    title: "Comprovante digital",
    description: "Recibo eletrônico na hora da entrega",
    icon: Package
  }
];

const fleetGallery = [
  {
    title: "Veículos próprios",
    description: "Frota de 15 veículos para diferentes tipos de carga"
  },
  {
    title: "Equipamentos de carga",
    description: "Munck, empilhadeiras e equipamentos especiais"
  },
  {
    title: "Motoristas treinados",
    description: "Equipe especializada em materiais industriais"
  }
];

const operationalPolicies = [
  {
    title: "Janelas de entrega",
    content: "Trabalhamos com janelas de 2 horas para entregas agendadas. Para entregas expressas, o prazo é de até 4 horas após confirmação do pedido. O cliente é sempre comunicado sobre qualquer alteração de prazo."
  },
  {
    title: "Recebimento",
    content: "É necessário haver responsável no local para recebimento. Para materiais de grande porte, verificamos as condições de acesso previamente. Em caso de impossibilidade de entrega, reagendamos sem custos adicionais."
  },
  {
    title: "Conferência",
    content: "Todos os itens são conferidos na presença do recebedor. Divergências devem ser apontadas no momento da entrega. Oferecemos comprovante digital detalhado de todos os itens entregues."
  },
  {
    title: "Devoluções",
    content: "Materiais com defeito ou divergência podem ser devolvidos no mesmo veículo. Para devoluções posteriores, coletamos sem custo adicional mediante agendamento prévio."
  }
];

const fleetFaqs = [
  {
    question: "Qual é o valor do frete?",
    answer: "O frete é calculado com base na distância, peso e volume da carga. Oferecemos frete grátis para pedidos acima de R$ 500,00 dentro de São Paulo capital."
  },
  {
    question: "Fazem entrega em finais de semana?",
    answer: "Sim, realizamos entregas aos sábados mediante agendamento prévio. Domingos e feriados apenas para emergências com taxa adicional."
  },
  {
    question: "Posso acompanhar minha entrega?",
    answer: "Sim, enviamos link de rastreamento via WhatsApp assim que o pedido sai para entrega. Você pode acompanhar a localização em tempo real."
  }
];

export default function Fleet() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Logística própria para você não parar"
        subtitle="Frota própria com 15 veículos, janelas de entrega de 2 horas e rastreamento em tempo real. Entregamos em toda Grande São Paulo."
        primaryCTA="Solicitar entrega"
        secondaryCTA="Ver regiões"
        onSecondaryCTA={() => document.getElementById('regions')?.scrollIntoView({ behavior: 'smooth' })}
      />

      {/* Do pátio ao seu destino */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Do pátio ao seu destino, com controle de ponto a ponta
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Cada etapa do processo é monitorada para garantir que seus materiais cheguen no prazo e em perfeitas condições.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryFeatures.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover-lift border-none shadow-card">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">{feature}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Onde entregamos */}
      <section id="regions" className="py-20 bg-gradient-subtle">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8">
                Onde entregamos
              </h2>
              
              <div className="space-y-4 mb-8">
                {deliveryRegions.map((region, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{region}</span>
                  </div>
                ))}
              </div>
              
              <Button
                onClick={() => openWhatsApp({ context: "Gostaria de solicitar orçamento de frete" })}
                variant="default"
                size="lg"
              >
                Solicitar orçamento de frete
              </Button>
            </div>
            
            <div className="relative">
              <Card className="shadow-card border-none">
                <CardContent className="p-6">
                  <div className="aspect-video bg-secondary rounded-xl flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-sm">Mapa das regiões atendidas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Como combinamos prazos */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Como combinamos prazos
            </h2>
            <p className="text-xl text-muted-foreground">
              Três opções de entrega para atender suas necessidades
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {deliveryTypes.map((type, index) => (
              <Card key={index} className="text-center p-8 hover-lift border-none shadow-card">
                <CardContent className="p-0">
                  <div className="text-4xl mb-4">{type.icon}</div>
                  <h3 className="font-semibold text-xl mb-3 text-foreground">{type.title}</h3>
                  <p className="text-muted-foreground mb-4">{type.description}</p>
                  <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                    SLA: {type.sla}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Preferir retirar? */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Preferir retirar? Facilidade na porta
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div className="text-muted-foreground">
                    <div className="font-medium text-foreground mb-1">Endereço para retirada:</div>
                    <div>Rua Industrial, 123 - Distrito Industrial</div>
                    <div>São Paulo - SP, CEP 01234-567</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div className="text-muted-foreground">
                    <div className="font-medium text-foreground mb-1">Horários de retirada:</div>
                    <div>Segunda a sexta: 8h às 18h</div>
                    <div>Sábados: 8h às 12h</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Card className="shadow-card border-none">
                <CardContent className="p-6">
                  <div className="aspect-video bg-secondary rounded-xl flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Truck className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-sm">Área de retirada</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Transparência sem complicação */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Transparência sem complicação
            </h2>
            <p className="text-xl text-muted-foreground">
              Você sempre sabe onde está seu pedido e quando chegará
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {transparencyFeatures.map((feature, index) => (
              <Card key={index} className="text-center p-8 hover-lift border-none shadow-card">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button
              onClick={() => openWhatsApp({ context: "Gostaria de acompanhar um pedido" })}
              variant="outline"
              size="lg"
            >
              Acompanhar pedido
            </Button>
          </div>
        </div>
      </section>

      {/* Nossa frota em ação */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Nossa frota em ação
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {fleetGallery.map((item, index) => (
              <Card key={index} className="overflow-hidden hover-lift border-none shadow-card">
                <div className="aspect-video bg-secondary flex items-center justify-center">
                  <Truck className="w-16 h-16 text-muted-foreground" />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Política operacional */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Política operacional (resumo)
            </h2>
            <p className="text-xl text-muted-foreground">
              Nossos compromissos e procedimentos para garantir o melhor atendimento
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {operationalPolicies.map((policy, index) => (
                <AccordionItem key={index} value={`policy-${index}`} className="border border-border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-medium hover:no-underline">
                    {policy.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {policy.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Perguntas frequentes
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {fleetFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`} className="border border-border rounded-lg px-6">
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

      {/* CTA Final */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Vamos levar até você
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Solicite um orçamento de frete ou agende sua entrega
          </p>
          <Button
            onClick={() => openWhatsApp({ context: "Gostaria de solicitar entrega" })}
            variant="accent"
            size="xl"
            className="font-semibold"
          >
            Solicitar entrega
          </Button>
        </div>
      </section>
    </div>
  );
}