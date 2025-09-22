import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openWhatsApp } from "@/lib/whatsapp";

interface NotFoundSectionProps {
  title: string;
  description: string;
  buttonText: string;
  whatsappContext: string;
}

export default function NotFoundSection({
  title,
  description,
  buttonText,
  whatsappContext,
}: NotFoundSectionProps) {
  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="container-custom text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
          <p className="text-muted-foreground mb-8">{description}</p>
          <Button
            onClick={() => openWhatsApp({ context: whatsappContext })}
            variant="hero"
            size="lg"
            className="text-black hover:text-black"
          >
            <Search className="w-5 h-5 mr-2" />
            {buttonText}
          </Button>
        </div>
      </div>
    </section>
  );
}