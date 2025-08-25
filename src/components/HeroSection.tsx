import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openWhatsApp } from "@/lib/whatsapp";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  primaryCTA: string;
  primaryVariant?: "default" | "accent" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "hero" | "whatsapp";
  secondaryCTA?: string;
  secondaryVariant?: "default" | "accent" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "hero" | "whatsapp";
  onSecondaryCTA?: () => void;
  showVideo?: boolean;
}

export default function HeroSection({
  title,
  subtitle,
  primaryCTA,
  primaryVariant = "accent",
  secondaryCTA,
  secondaryVariant = "outline",
  onSecondaryCTA,
  showVideo = false
}: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-hero text-white overflow-hidden">
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
                {title}
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed max-w-2xl">
                {subtitle}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => openWhatsApp({ page: "hero" })}
                variant={primaryVariant}
                size="lg"
                className="font-semibold px-8 py-4 text-lg group"
              >
                {primaryCTA}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              {secondaryCTA && (
                <Button
                  onClick={onSecondaryCTA}
                  variant={secondaryVariant}
                  size="lg"
                  className="px-8 py-4 text-lg"
                >
                  {secondaryCTA}
                </Button>
              )}
            </div>
          </div>

          {/* Quality Banner */}
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
                    <p className="text-sm font-semibold text-white">+25 Anos</p>
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
      
      {/* Bottom Wave - Improved curve */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-16 lg:h-24" viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 120L50 105C100 90 200 60 300 45C400 30 500 30 600 37.5C700 45 800 60 900 67.5C1000 75 1100 75 1150 75L1200 75V120H1150C1100 120 1000 120 900 120C800 120 700 120 600 120C500 120 400 120 300 120C200 120 100 120 50 120H0V120Z" fill="currentColor" className="text-background"/>
        </svg>
      </div>
    </section>
  );
}