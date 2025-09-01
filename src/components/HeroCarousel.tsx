import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openWhatsApp } from "@/lib/whatsapp";

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  primaryCTA: string;
  secondaryCTA: string;
  secondaryAction?: () => void;
  whatsappContext: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    title: "Seu fornecedor industrial, rápido e sem complicações",
    subtitle: "Ferro & Aço, ferramentas, EPIs e insumos industriais. Logística própria, atendimento 24h e mais de 20 anos de experiência.",
    primaryCTA: "WhatsApp",
    secondaryCTA: "Ver categorias",
    whatsappContext: "Gostaria de falar sobre fornecimento industrial"
  },
  {
    id: 2,
    title: "EPIs Certificados para sua equipe",
    subtitle: "Equipamentos de proteção individual com certificação INMETRO. Capacetes, luvas, calçados e muito mais para a segurança do seu time.",
    primaryCTA: "WhatsApp",
    secondaryCTA: "Ver EPIs",
    whatsappContext: "Gostaria de um orçamento para EPIs certificados"
  },
  {
    id: 3,
    title: "Ferro & Aço para sua obra",
    subtitle: "Barras, chapas, tubos e perfis em diversas especificações. Corte sob medida e entrega rápida para sua construção ou indústria.",
    primaryCTA: "WhatsApp", 
    secondaryCTA: "Ver Ferro & Aço",
    whatsappContext: "Gostaria de um orçamento para ferro e aço"
  },
  {
    id: 4,
    title: "Ferramentas Profissionais de primeira linha",
    subtitle: "Elétricas, manuais e à bateria das melhores marcas. Qualidade profissional para aumentar a produtividade da sua equipe.",
    primaryCTA: "WhatsApp",
    secondaryCTA: "Ver Ferramentas", 
    whatsappContext: "Gostaria de um orçamento para ferramentas profissionais"
  }
];

const scrollToCategories = () => {
  document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
};

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  const handleMouseEnter = () => {
    setIsPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsPlaying(true);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  const getSecondaryAction = (slide: SlideData) => {
    switch (slide.id) {
      case 2:
        return () => window.location.href = "/catalogo#epis";
      case 3:
        return () => window.location.href = "/catalogo#ferro-aco";
      case 4:
        return () => window.location.href = "/catalogo#ferramentas-eletricas";
      default:
        return scrollToCategories;
    }
  };

  return (
    <section 
      className="relative bg-gradient-hero text-white overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='5' cy='5' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          width: '100%',
          height: '100%'
        }} />
      </div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px] py-20">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                {currentSlideData.title}
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed max-w-2xl">
                {currentSlideData.subtitle}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => openWhatsApp({ 
                  page: "hero carousel", 
                  context: currentSlideData.whatsappContext 
                })}
                variant="whatsapp"
                size="lg"
                className="font-semibold px-8 py-4 text-lg group"
              >
                {currentSlideData.primaryCTA}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                onClick={getSecondaryAction(currentSlideData)}
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg border-white/30 text-white hover:bg-white/10 hover:border-white/50"
              >
                {currentSlideData.secondaryCTA}
              </Button>
            </div>

            {/* Slide Indicators (Dots) */}
            <div className="flex space-x-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-accent scale-110'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Quality Banner - Mantido do design original */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-card-hover border border-white/20">
              <div className="text-center space-y-6">
                {/* Main Quality Message */}
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-4">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">✓</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-tight">
                    PRODUTOS DE<br />QUALIDADE COMPROVADA
                  </h3>
                  <p className="text-white/80 text-lg">
                    Certificações internacionais e garantia de procedência
                  </p>
                </div>

                {/* Certification Badges */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">🏆</div>
                    <p className="text-sm font-semibold text-white">ISO 9001</p>
                    <p className="text-xs text-white/70">Qualidade</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">🛡️</div>
                    <p className="text-sm font-semibold text-white">INMETRO</p>
                    <p className="text-xs text-white/70">Conformidade</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">⚡</div>
                    <p className="text-sm font-semibold text-white">+20 Anos</p>
                    <p className="text-xs text-white/70">Experiência</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">🚚</div>
                    <p className="text-sm font-semibold text-white">Entrega</p>
                    <p className="text-xs text-white/70">Garantida</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-accent rounded-full animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-white/20 rounded-full"></div>
              <div className="absolute top-4 left-4 w-2 h-2 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
        aria-label="Próximo slide"
      >
        <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>
      
      {/* Bottom Wave - Mantido do design original */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-16 lg:h-24" viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 120L50 105C100 90 200 60 300 45C400 30 500 30 600 37.5C700 45 800 60 900 67.5C1000 75 1100 75 1150 75L1200 75V120H1150C1100 120 1000 120 900 120C800 120 700 120 600 120C500 120 400 120 300 120C200 120 100 120 50 120H0V120Z" fill="currentColor" className="text-background"/>
        </svg>
      </div>
    </section>
  );
}