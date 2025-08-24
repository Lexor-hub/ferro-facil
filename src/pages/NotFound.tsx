import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-8xl font-bold text-primary mb-4">404</div>
        <h1 className="text-2xl font-bold text-foreground mb-4">Página não encontrada</h1>
        <p className="text-muted-foreground mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="default" size="lg" className="w-full sm:w-auto">
              <Home className="w-5 h-5 mr-2" />
              Voltar ao início
            </Button>
          </Link>
          <Link to="/catalogo">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Search className="w-5 h-5 mr-2" />
              Ver catálogo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
