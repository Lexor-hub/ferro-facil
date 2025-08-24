import { MapPin, Phone, Mail, Clock, Users, MessageCircle, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HeroSection from "@/components/HeroSection";
import { openWhatsApp } from "@/lib/whatsapp";

const contactMethods = [
  {
    title: "Diretor Técnico — Edson Luiz Soares",
    description: "Para questões técnicas, projetos especiais e parcerias",
    email: "diretoria@gruposoares.com.br",
    phone: "(11) 99988-7760",
    icon: Users
  },
  {
    title: "Orçamentos",
    description: "Solicitações de orçamento e propostas comerciais",
    email: "orcamentos@gruposoares.com.br", 
    phone: "(11) 99988-7761",
    icon: Mail
  },
  {
    title: "Atendimento Técnico",
    description: "Suporte técnico e especificação de produtos",
    phone: "(11) 99988-7762",
    icon: Phone
  },
  {
    title: "Telefones gerais",
    description: "Atendimento geral e informações",
    phone: "(11) 99988-7766",
    secondaryPhone: "(11) 3456-7890",
    icon: Phone
  }
];

const companies = [
  {
    name: "Edson Luiz Soares São Roque — ME",
    cnpj: "12.345.678/0001-90",
    address: "Rua Industrial, 123 - Distrito Industrial - São Paulo/SP",
    cep: "01234-567"
  },
  {
    name: "Luiz Bernardes Soares Ltda",
    cnpj: "23.456.789/0001-01", 
    address: "Av. das Indústrias, 456 - Jardim Industrial - São Paulo/SP",
    cep: "01234-890"
  },
  {
    name: "Rio Vibe Soares — ME", 
    cnpj: "34.567.890/0001-12",
    address: "Rua dos Ferragens, 789 - Centro Industrial - São Paulo/SP",
    cep: "01234-123"
  }
];

const businessHours = {
  store: {
    title: "Loja/Orçamentos:",
    hours: [
      "Seg-Sex: 8:00 às 18:00",
      "Sáb: 7:00 às 12:00"
    ]
  },
  emergency: {
    title: "Emergencial 24h",
    description: "via WhatsApp em urgências",
    highlight: true
  }
};

export default function Contact() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Ainda possui alguma dúvida?"
        subtitle="Nossa equipe está pronta para ajudar. Entre em contato pelos nossos canais ou visite nossa loja."
        primaryCTA="Enviar um contato agora"
        secondaryCTA="Ver no mapa"
        onSecondaryCTA={() => document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' })}
      />

      {/* Formas de Contato */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Formas de Contato
            </h2>
            <p className="text-xl text-muted-foreground">
              Escolha o canal mais adequado para seu tipo de solicitação
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contactMethods.map((method, index) => (
              <Card key={index} className="p-6 hover-lift border-none shadow-card">
                <CardContent className="p-0">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <method.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2 text-foreground">{method.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{method.description}</p>
                      
                      <div className="space-y-2">
                        {method.email && (
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <a 
                              href={`mailto:${method.email}`}
                              className="text-sm text-primary hover:underline"
                            >
                              {method.email}
                            </a>
                          </div>
                        )}
                        
                        {method.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <a 
                              href={`tel:${method.phone.replace(/\D/g, '')}`}
                              className="text-sm text-primary hover:underline"
                            >
                              {method.phone}
                            </a>
                          </div>
                        )}
                        
                        {method.secondaryPhone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <a 
                              href={`tel:${method.secondaryPhone.replace(/\D/g, '')}`}
                              className="text-sm text-primary hover:underline"
                            >
                              {method.secondaryPhone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* WhatsApp Comercial destacado */}
          <div className="mt-12">
            <Card className="p-8 bg-green-50 border-green-200 shadow-card">
              <CardContent className="p-0">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-2xl mb-4 text-foreground">WhatsApp comercial</h3>
                  <p className="text-muted-foreground mb-6">
                    O jeito mais rápido de falar conosco. Atendimento personalizado e ágil.
                  </p>
                  <Button
                    onClick={() => openWhatsApp({ context: "Gostaria de falar com o comercial" })}
                    variant="whatsapp"
                    size="lg"
                    className="font-semibold px-8"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Abrir WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Onde estamos */}
      <section id="location" className="py-20 bg-gradient-subtle">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8">
                Onde estamos
              </h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div className="text-muted-foreground">
                    <div className="font-medium text-foreground mb-1">Endereço principal:</div>
                    <div>Rua Industrial, 123</div>
                    <div>Distrito Industrial</div>
                    <div>São Paulo - SP, CEP 01234-567</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-primary flex-shrink-0" />
                  <div className="text-muted-foreground">
                    <div className="font-medium text-foreground mb-1">Telefone principal:</div>
                    <a href="tel:+5511999887766" className="text-primary hover:underline">
                      (11) 99988-7766
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => window.open('https://maps.google.com/maps?q=Rua+Industrial+123+São+Paulo', '_blank')}
                  variant="outline"
                  size="lg"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Traçar rota
                </Button>
                <Button
                  onClick={() => openWhatsApp({ context: "Gostaria de visitar a loja" })}
                  variant="whatsapp"
                  size="lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <Card className="shadow-card border-none">
                <CardContent className="p-6">
                  <div className="aspect-video bg-secondary rounded-xl flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-sm">Mapa com localização</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        Clique em "Traçar rota" para abrir no Google Maps
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Empresas do Grupo */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Empresas do Grupo
            </h2>
            <p className="text-xl text-muted-foreground">
              Conheça as empresas que compõem o Grupo Soares
            </p>
          </div>
          
          <div className="space-y-6">
            {companies.map((company, index) => (
              <Card key={index} className="p-6 hover-lift border-none shadow-card">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{company.name}</h3>
                        <p className="text-sm text-muted-foreground">CNPJ: {company.cnpj}</p>
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="text-muted-foreground">
                          <div>{company.address}</div>
                          <div>CEP: {company.cep}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Horários */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Horários
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 shadow-card border-none bg-white">
              <CardContent className="p-0">
                <div className="flex items-center space-x-4 mb-6">
                  <Clock className="w-8 h-8 text-primary" />
                  <h3 className="font-semibold text-xl text-foreground">{businessHours.store.title}</h3>
                </div>
                <div className="space-y-2">
                  {businessHours.store.hours.map((hour, index) => (
                    <div key={index} className="text-muted-foreground">{hour}</div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-8 shadow-card border-none bg-accent/10 border-accent/20">
              <CardContent className="p-0">
                <div className="flex items-center space-x-4 mb-4">
                  <MessageCircle className="w-8 h-8 text-accent" />
                  <h3 className="font-semibold text-xl text-accent">{businessHours.emergency.title}</h3>
                </div>
                <p className="text-accent/80 mb-6">{businessHours.emergency.description}</p>
                <Button
                  onClick={() => openWhatsApp({ context: "Tenho uma urgência" })}
                  variant="accent"
                  size="lg"
                  className="w-full"
                >
                  Contato emergencial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Pronto para falar com a Loja?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Escolha o canal de sua preferência
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => openWhatsApp({ context: "Gostaria de entrar em contato" })}
              variant="accent"
              size="xl"
              className="font-semibold"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp
            </Button>
            <Button
              onClick={() => window.open('tel:+5511999887766')}
              variant="outline"
              size="xl"
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold"
            >
              <Phone className="w-5 h-5 mr-2" />
              Ligar agora
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}