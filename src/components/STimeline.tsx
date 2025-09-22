import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    id: 1,
    title: "Você faz o pedido",
    description: "O que precisa, onde e para quando.",
    position: { desktop: { x: 10, y: 10 }, mobile: { x: 0, y: 0 } }
  },
  {
    id: 2,
    title: "A gente confere",
    description: "Medidas, material, compatibilidade e norma.",
    position: { desktop: { x: 90, y: 25 }, mobile: { x: 0, y: 20 } }
  },
  {
    id: 3,
    title: "Proposta direta",
    description: "Itens, prazos e condições claros.",
    position: { desktop: { x: 15, y: 40 }, mobile: { x: 0, y: 40 } }
  },
  {
    id: 4,
    title: "Separação e preparo",
    description: "Cortes e kits, se necessário.",
    position: { desktop: { x: 85, y: 55 }, mobile: { x: 0, y: 60 } }
  },
  {
    id: 5,
    title: "Entrega ou retirada",
    description: "Você escolhe; status acompanhado.",
    position: { desktop: { x: 20, y: 70 }, mobile: { x: 0, y: 80 } }
  },
  {
    id: 6,
    title: "Acompanhamento pós venda",
    description: "Reposição e ajustes rápidos.",
    position: { desktop: { x: 80, y: 85 }, mobile: { x: 0, y: 100 } }
  }
];

export default function STimeline() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepId = parseInt(entry.target.getAttribute('data-step') || '0');
            setVisibleSteps(prev => [...new Set([...prev, stepId])]);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -20% 0px'
      }
    );

    const stepElements = document.querySelectorAll('[data-step]');
    stepElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Desktop Timeline - Grid Layout */}
      {!isMobile && (
        <div className="hidden md:grid grid-cols-2 gap-x-12 gap-y-16 w-full relative py-8">
          {/* Linha central vertical */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary opacity-50 z-0 transform -translate-x-1/2"></div>
          
          {steps.map((step, index) => {
            const isVisible = visibleSteps.includes(step.id);
            const isEven = index % 2 === 0;
            
            return (
              <div
                key={step.id}
                data-step={step.id}
                className={`${isEven ? 'justify-self-end' : 'justify-self-start'} transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                <Card className="border-none shadow-card w-full max-w-md relative">
                  {/* Connecting element */}
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isEven ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'} w-8 h-0.5 bg-primary`}>
                    <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="text-sm text-primary font-semibold mb-2">
                      Passo {step.id}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile Timeline - Vertical Cards */}
      <div className="md:hidden space-y-6 relative">
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-primary opacity-50 z-0" style={{ height: 'calc(100% - 32px)', transform: 'translateX(3.5px)' }}></div>
        
        {steps.map((step, index) => (
          <div
            key={step.id}
            data-step={step.id}
            className={`transition-all duration-700 relative z-10 ${visibleSteps.includes(step.id) ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
          >
            <Card className="border-none shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0 transition-all duration-500 ${visibleSteps.includes(step.id) ? 'bg-primary text-white' : 'bg-background text-primary'}`}>
                    <span className="text-sm font-bold">{step.id}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2 text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Accessibility fallback for reduced motion */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .s-timeline * {
            animation: none !important;
            transition: none !important;
          }
          .s-timeline [data-step] {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}