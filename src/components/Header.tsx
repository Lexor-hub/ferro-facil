import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { openWhatsApp } from "@/lib/whatsapp";
const navigation = [{
  name: "Início",
  href: "/"
}, {
  name: "Catálogo",
  href: "/catalogo"
}, {
  name: "Empresa",
  href: "/empresa"
}];
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  return <header className={`header-fixed transition-all duration-300 ${isScrolled ? "bg-gradient-premium/95 backdrop-blur-sm shadow-premium" : "bg-gradient-premium shadow-card"}`}>
      <nav className="container-custom h-header">
        <div className="flex items-center justify-between h-full">
          {/* Logo - Fixed width container for consistency */}
          <div className="flex-shrink-0 w-64">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 flex-shrink-0 shadow-premium">
                <img 
                  src="/lovable-uploads/196c5da4-f510-457d-b523-c41e777fe6bf.png" 
                  alt="Logo Grupo Soares"
                  className="w-full h-full object-contain drop-shadow-lg"
                  onError={(e) => {
                    // Fallback to SVG if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallbackDiv = target.nextElementSibling as HTMLDivElement;
                    if (fallbackDiv) fallbackDiv.style.display = 'block';
                  }}
                />
                <div className="w-full h-full hidden">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="50" fill="hsl(var(--primary))" />
                    <g fill="white" transform="translate(50,50)">
                      <path d="M-8,-20 L-8,-16 L-16,-16 L-16,-8 L-20,-8 L-20,8 L-16,8 L-16,16 L-8,16 L-8,20 L8,20 L8,16 L16,16 L16,8 L20,8 L20,-8 L16,-8 L16,-16 L8,-16 L8,-20 Z" />
                      <circle cx="0" cy="0" r="8" fill="hsl(var(--primary))" />
                      <circle cx="0" cy="0" r="4" fill="white" />
                    </g>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <div className="font-bold text-lg text-white leading-tight truncate">Grupo Soares</div>
                <div className="text-xs text-white/70 font-medium tracking-wide truncate">
                  Soluções Industriais
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-6">
              {navigation.map(item => (
                <Link 
                  key={item.href} 
                  to={item.href} 
                  className={`text-sm font-medium transition-colors hover:text-white/80 whitespace-nowrap py-2 ${
                    location.pathname === item.href ? "text-white font-semibold" : "text-white/70"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Buttons - Fixed width container */}
          <div className="hidden md:flex items-center justify-end w-64">
            <Button 
              onClick={() => openWhatsApp({ page: "header" })} 
              variant="whatsapp"
              className="whitespace-nowrap flex-shrink-0"
              size="default"
            >
              Chamar no WhatsApp
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 rounded-lg hover:bg-white/10 transition-colors focus-ring text-white" 
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-white/20 shadow-card bg-gradient-premium">
          <div className="container-custom py-6 space-y-4">
            <div className="space-y-3">
              {navigation.map(item => (
                <Link 
                  key={item.href} 
                  to={item.href} 
                  className={`block text-base font-medium transition-colors hover:text-white/80 py-2 ${
                    location.pathname === item.href ? "text-white font-semibold" : "text-white/70"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            <div className="pt-4 border-t border-white/20 space-y-4">
              <Button 
                onClick={() => openWhatsApp({ page: "header mobile" })} 
                variant="whatsapp"
                className="w-full py-3"
                size="lg"
              >
                Chamar no WhatsApp
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>;
}
