import { useRef } from "react";
import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CategoryCarouselItem {
  name: string;
  href: string;
  image: string;
  icon?: string;
  description?: string;
}

interface CategoryCarouselProps {
  categories: CategoryCarouselItem[];
}

const CategoryCarousel = ({ categories }: CategoryCarouselProps) => {
  const autoplay = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  if (!categories?.length) {
    return null;
  }

  return (
    <section className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <Carousel
          opts={{ align: "start", loop: true, dragFree: true }}
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={autoplay.current.reset}
          className="relative"
        >
          <CarouselContent>
            {categories.map((category) => (
              <CarouselItem
                key={category.href}
                className="basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-4"
              >
                <Link
                  to={category.href}
                  className="group block h-full rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex flex-col h-full items-center text-center px-4 py-6 gap-4">
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-white shadow-inner flex items-center justify-center overflow-hidden">
                      {category.icon ? (
                        <span className="absolute -top-3 -right-2 text-xl drop-shadow">
                          {category.icon}
                        </span>
                      ) : null}
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-foreground sm:text-base">
                        {category.name}
                      </h3>
                      {category.description ? (
                        <p className="text-xs text-muted-foreground sm:text-sm line-clamp-2">
                          {category.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4 lg:-left-10" />
          <CarouselNext className="hidden md:flex -right-4 lg:-right-10" />
        </Carousel>
      </div>
    </section>
  );
};

export default CategoryCarousel;
