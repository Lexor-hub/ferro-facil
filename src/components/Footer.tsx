import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { openWhatsApp } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Grupo Soares */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">GS</span>
              </div>
              <div>
                <div className="font-bold text-lg">Grupo Soares</div>
                <div className="text-xs text-white/70">Ferro & Aço</div>
              </div>
            </div>
            <p className="text-white/80 text-sm mb-6">
              Mais de 20 anos fornecendo soluções industriais com qualidade, 
              agilidade e atendimento personalizado para sua empresa.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => openWhatsApp({ context: "Gostaria de conhecer mais sobre o Grupo Soares" })}
                className="text-accent hover:text-accent-foreground transition-colors"
              >
                WhatsApp
              </button>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-white/80 hover:text-white transition-colors text-sm">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="text-white/80 hover:text-white transition-colors text-sm">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/servicos" className="text-white/80 hover:text-white transition-colors text-sm">
                  Serviços
                </Link>
              </li>
              <li>
                <Link to="/frota-logistica" className="text-white/80 hover:text-white transition-colors text-sm">
                  Frota & Logística
                </Link>
              </li>
              <li>
                <Link to="/empresa" className="text-white/80 hover:text-white transition-colors text-sm">
                  Empresa
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-white/80 hover:text-white transition-colors text-sm">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div className="text-white/80 text-sm">
                  <div>R. Prof. Armando Lino Antunes, 251</div>
                  <div>DISTRITO INDUSTRIAL</div>
                  <div>Mairinque - SP, CEP 18120-000</div>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <a
                  href="tel:+5511999887766"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  (11) 99988-7766
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <a
                  href="mailto:contato@gruposoares.com.br"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  contato@gruposoares.com.br
                </a>
              </li>
            </ul>
          </div>

          {/* Horários */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Horários</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div className="text-white/80 text-sm">
                  <div className="font-medium text-white mb-2">Loja/Orçamentos:</div>
                  <div>Seg-Sex: 8:00 às 18:00</div>
                  <div>Sáb: 7:00 às 12:00</div>
                </div>
              </div>
              <div className="bg-accent/20 p-3 rounded-lg">
                <div className="text-accent font-medium text-sm mb-1">
                  Emergencial 24h
                </div>
                <div className="text-white/80 text-xs">
                  Via WhatsApp em urgências
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white/60 text-sm">
              © 2024 Grupo Soares. Todos os direitos reservados.
            </div>
            <div className="flex space-x-6 text-sm">
              <span className="text-white/60">CNPJ: 12.345.678/0001-90</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}