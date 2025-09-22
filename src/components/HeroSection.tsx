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
  showQualityBanner?: boolean;
  className?: string;
}

export default function HeroSection({
  title,
  subtitle,
  primaryCTA,
  primaryVariant = "accent",
  secondaryCTA,
  secondaryVariant = "outline",
  onSecondaryCTA,
  showVideo = false,
  showQualityBanner = false,
  className,
}: HeroSectionProps) {
  return (
    <section className={`relative bg-gradient-hero text-white overflow-hidden ${className}`}>
      {/* Premium Mesh Background */}
      <div className="absolute inset-0 bg-gradient-mesh"></div>

      {/* Floating Geometric Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large floating circle */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-white/5 rounded-full float-element blur-sm"></div>

        {/* Medium floating squares */}
        <div className="absolute top-40 left-16 w-16 h-16 bg-accent/10 rotate-12 float-element-slow"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-white/8 rotate-45 float-element"></div>

        {/* Small floating dots */}
        <div className="absolute top-60 left-1/4 w-4 h-4 bg-accent/30 rounded-full float-element"></div>
        <div className="absolute bottom-40 left-20 w-6 h-6 bg-white/15 rounded-full float-element-slow"></div>
        <div className="absolute top-32 right-1/3 w-3 h-3 bg-accent/40 rounded-full float-element"></div>

        {/* Premium pattern overlay */}
        <div className="absolute inset-0 opacity-30 mesh-gradient"></div>
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
              

            </div>
          </div>

          {/* Quality Banner - Only show when showQualityBanner is true */}
          {showQualityBanner && (
            <div className="relative fade-in-up">
              {/* Premium Glass Card */}
              <div className="glass-card rounded-3xl p-8 shadow-premium relative overflow-hidden">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 rounded-3xl"></div>

                <div className="text-center space-y-6 relative z-10">
                  {/* Main Quality Message */}
                  <div className="space-y-3">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent to-accent-dark rounded-2xl mb-4 shadow-glow float-element">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <span className="text-white font-bold text-xl">✓</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white leading-tight">
                      PRODUTOS DE<br />QUALIDADE COMPROVADA
                    </h3>
                    <p className="text-white/80 text-lg">
                      Certificações internacionais e garantia de procedência
                    </p>
                  </div>

                  {/* Premium Certification Badges */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card rounded-xl p-4 text-center hover-lift group">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">🏆</div>
                      <p className="text-sm font-bold text-white">ISO 9001</p>
                      <p className="text-xs text-white/70">Qualidade</p>
                    </div>
                    <div className="glass-card rounded-xl p-4 text-center hover-lift group">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">🛡️</div>
                      <p className="text-sm font-bold text-white">INMETRO</p>
                      <p className="text-xs text-white/70">Conformidade</p>
                    </div>
                    <div className="glass-card rounded-xl p-4 text-center hover-lift group">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">⚡</div>
                      <p className="text-sm font-bold text-white">+15 Anos</p>
                      <p className="text-xs text-white/70">Experiência</p>
                    </div>
                    <div className="glass-card rounded-xl p-4 text-center hover-lift group">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">🚚</div>
                      <p className="text-sm font-bold text-white">Entrega</p>
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
          )}
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