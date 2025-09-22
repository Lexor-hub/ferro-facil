import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  image: string;
  title: string;
  description: string;
  slug: string;
}

export default function CategoryCard({ image, title, description, slug }: CategoryCardProps) {
  return (
    <Link to={`/categoria/${slug}`} className="block">
      <Card className="overflow-hidden hover-premium border-none shadow-card h-full flex flex-col group card-premium relative">
        {/* Premium image container with overlay */}
        <div className="aspect-[4/3] bg-secondary overflow-hidden relative">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          />

          {/* Premium gradient overlay */}
          <div className="absolute inset-0 bg-gradient-card-overlay opacity-0 group-hover:opacity-60 transition-all duration-500"></div>

          {/* Floating icon on hover */}
          <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
            <ArrowRight className="w-5 h-5 text-white" />
          </div>

          {/* Premium shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
        </div>

        <CardContent className="p-6 flex-1 flex flex-col relative z-10">
          <h3 className="font-bold text-xl text-foreground leading-tight mb-3 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-6 flex-1 line-clamp-2">{description}</p>

          {/* Premium CTA */}
          <div className="flex items-center justify-between">
            <span className="text-primary font-bold text-sm group-hover:text-accent transition-colors duration-300">
              Ver produtos
            </span>
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-all duration-300 group-hover:scale-110">
              <ArrowRight className="w-4 h-4 text-primary group-hover:text-accent transition-all duration-300 group-hover:translate-x-0.5" />
            </div>
          </div>
        </CardContent>

        {/* Premium accent border */}
        <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-accent/20 transition-all duration-500"></div>
      </Card>
    </Link>
  );
}