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
  name: "Serviços",
  href: "/servicos"
}, {
  name: "Frota & Logística",
  href: "/frota-logistica"
}, {
  name: "Empresa",
  href: "/empresa"
}, {
  name: "Contato",
  href: "/contato"
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
  return <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-sm shadow-card" : "bg-white"}`}>
      <nav className="container-custom h-header flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">GS</span>
          </div>
          <div>
            <div className="font-bold text-lg text-foreground">Grupo Soares</div>
            <div className="text-xs text-muted-foreground">
          </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {navigation.map(item => <Link key={item.href} to={item.href} className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === item.href ? "text-primary" : "text-muted-foreground"}`}>
              {item.name}
            </Link>)}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <a href="tel:+5511999887766" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <Phone className="w-4 h-4 mr-2" />
            (11) 99988-7766
          </a>
          <Button onClick={() => openWhatsApp({
          page: "header"
        })} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Chamar no WhatsApp
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors focus-ring" aria-label="Toggle menu">
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && <div className="lg:hidden bg-white border-t border-border">
          <div className="container-custom py-4 space-y-4">
            {navigation.map(item => <Link key={item.href} to={item.href} className={`block text-sm font-medium transition-colors hover:text-primary ${location.pathname === item.href ? "text-primary" : "text-muted-foreground"}`}>
                {item.name}
              </Link>)}
            <div className="pt-4 border-t border-border space-y-3">
              <a href="tel:+5511999887766" className="flex items-center text-sm text-muted-foreground">
                <Phone className="w-4 h-4 mr-2" />
                (11) 99988-7766
              </a>
              <Button onClick={() => openWhatsApp({
            page: "header mobile"
          })} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Chamar no WhatsApp
              </Button>
            </div>
          </div>
        </div>}
    </header>;
}