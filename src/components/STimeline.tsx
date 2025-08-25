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
    title: "Pós-venda sem atrito",
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

  // SVG Path for S-curve
  const sPath = isMobile 
    ? "M 50 0 L 50 100" // Straight line on mobile
    : "M 10 10 Q 50 15 90 25 Q 50 35 15 40 Q 50 50 85 55 Q 50 65 20 70 Q 50 80 80 85";

  return (
    <div ref={containerRef} className="relative">
      {/* Desktop S-Timeline */}
      {!isMobile && (
        <div className="hidden md:block relative h-[600px] w-full overflow-hidden">
          {/* SVG Path */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d={sPath}
              stroke="hsl(var(--primary))"
              strokeWidth="0.3"
              fill="none"
              strokeDasharray="2 2"
              className="opacity-30"
            />
            <path
              d={sPath}
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
              fill="none"
              strokeDasharray="2 2"
              strokeDashoffset="0"
              pathLength="100"
              className="opacity-60"
              style={{
                strokeDasharray: `${visibleSteps.length * 16.67} 100`,
                transition: 'stroke-dasharray 0.8s ease-out'
              }}
            />
          </svg>

          {/* Step Cards */}
          {steps.map((step, index) => {
            const isVisible = visibleSteps.includes(step.id);
            return (
              <div
                key={step.id}
                data-step={step.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${step.position.desktop.x}%`,
                  top: `${step.position.desktop.y}%`,
                }}
              >
                {/* Step marker */}
                <div 
                  className={`w-4 h-4 rounded-full border-2 border-primary bg-background absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-500 ${
                    isVisible ? 'bg-primary scale-110' : 'bg-background'
                  }`}
                />
                
                {/* Step card */}
                <Card 
                  className={`w-64 mt-6 border-none shadow-card transition-all duration-700 max-w-[calc(100vw-2rem)] ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
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

      {/* Mobile Simple List */}
      <div className="md:hidden space-y-6">
        {steps.map((step, index) => (
          <div
            key={step.id}
            data-step={step.id}
            className={`transition-all duration-700 ${
              visibleSteps.includes(step.id) ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            }`}
          >
            <Card className="border-none shadow-card">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                    visibleSteps.includes(step.id) ? 'bg-primary text-white' : 'bg-background text-primary'
                  }`}>
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