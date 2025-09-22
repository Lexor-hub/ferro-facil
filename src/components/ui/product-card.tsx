import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description?: string;
    price?: number;
    image_url?: string;
    category: string;
    sku?: string;
  };
  isOffer?: boolean;
  onQuoteClick: () => void;
}

export const ProductCard = ({ product, isOffer = false, onQuoteClick }: ProductCardProps) => {
  return (
    <Card
      className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-all duration-500 ease-out group hover:-translate-y-2 hover:border-transparent hover:shadow-[0_32px_70px_rgba(12,23,52,0.2)]"
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.25),rgba(13,34,71,0.85))]" aria-hidden="true"></div>
      <div className="absolute inset-x-0 top-0 h-24 translate-y-[-40%] bg-[radial-gradient(circle,rgba(255,255,255,0.55),transparent_70%)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true"></div>

      <CardHeader className="relative z-10 p-0">
        {isOffer && (
          <Badge
            variant="premium"
            className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-4 py-1.5 uppercase tracking-[0.3em] text-[0.65rem]"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Oferta
          </Badge>
        )}
        <div className="relative aspect-square overflow-hidden">
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_70%)]" aria-hidden="true"></div>
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-hover:rotate-[1deg]"
          />
        </div>
      </CardHeader>
      <CardContent className="relative z-10 flex flex-grow flex-col p-6">
        <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground transition-colors duration-500 group-hover:text-white/70">
          {product.category}
        </span>
        <h3 className="mb-2 flex-grow text-lg font-semibold text-foreground transition-colors duration-500 group-hover:text-white">
          {product.name}
        </h3>
        {product.sku && (
          <p className="mb-3 text-sm text-muted-foreground transition-colors duration-500 group-hover:text-white/70">
            SKU: {product.sku}
          </p>
        )}
        <div className="mt-auto border-t border-border pt-3 transition-colors duration-500 group-hover:border-white/30">
          <p className="text-lg font-semibold text-primary transition-colors duration-500 group-hover:text-white">
            {product.price ? `R$ ${product.price.toFixed(2)}` : "Preço sob consulta"}
          </p>
        </div>
      </CardContent>
      <CardFooter className="relative z-10 flex flex-col items-stretch gap-2 p-6 pt-0">
        <Button
          onClick={onQuoteClick}
          variant="hero"
          size="lg"
          className="justify-between px-5 py-5 text-sm tracking-wide text-white"
        >
          Solicitar Orçamento
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};
