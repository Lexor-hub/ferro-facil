import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CategoryChipsProps {
  categories: Array<{
    id: string;
    name: string;
    icon?: string;
  }>;
  activeCategory?: string;
  onCategoryClick?: (categoryId: string) => void;
}

export default function CategoryChips({ categories, activeCategory, onCategoryClick }: CategoryChipsProps) {
  const [visibleCategory, setVisibleCategory] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map(cat => document.getElementById(cat.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 120; // Account for header height

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setVisibleCategory(categories[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);

  const handleCategoryClick = (categoryId: string) => {
    onCategoryClick?.(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-24 bg-white/95 backdrop-blur-sm border-b border-border py-4 z-30">
      <div className="container-custom">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 hover:shadow-md",
                visibleCategory === category.id || activeCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary border border-border"
              )}
            >
              {category.icon && <span className="text-lg">{category.icon}</span>}
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}