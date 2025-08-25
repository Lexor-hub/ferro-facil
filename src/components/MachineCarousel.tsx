import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const machines = [
  {
    id: 1,
    name: "Corte a Plasma CNC",
    description: "Precisão em cortes complexos",
    image: "/frota-1.jpg",
    alt: "Máquina de corte a plasma CNC realizando corte de precisão em chapa metálica"
  },
  {
    id: 2,
    name: "Dobradeira Hidráulica",
    description: "Conformação de chapas e perfis",
    image: "/frota-2.jpg", 
    alt: "Dobradeira hidráulica industrial para conformação de chapas metálicas"
  },
  {
    id: 3,
    name: "Centro de Usinagem",
    description: "Usinagem de alta precisão",
    image: "/frota-3.jpg",
    alt: "Centro de usinagem CNC realizando operações de precisão"
  },
  {
    id: 4,
    name: "Serra Fita Industrial",
    description: "Cortes retos em barras e perfis",
    image: "/frota-1.jpg",
    alt: "Serra fita industrial para corte de barras e perfis metálicos"
  },
  {
    id: 5,
    name: "Prensa Excêntrica",
    description: "Conformação e estampagem",
    image: "/frota-2.jpg",
    alt: "Prensa excêntrica para operações de conformação e estampagem"
  },
  {
    id: 6,
    name: "Torno CNC",
    description: "Usinagem de peças cilíndricas",
    image: "/frota-3.jpg",
    alt: "Torno CNC para usinagem de precisão de peças cilíndricas"
  }
];

export default function MachineCarousel() {
  return (
    <div className="relative max-w-5xl mx-auto">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {machines.map((machine) => (
            <CarouselItem key={machine.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <Card className="overflow-hidden hover-lift border-none shadow-card">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={machine.image}
                    alt={machine.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold text-lg mb-1">{machine.name}</h3>
                    <p className="text-sm text-white/90">{machine.description}</p>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-8 lg:-left-12 bg-white shadow-card hover:shadow-card-hover" />
        <CarouselNext className="-right-8 lg:-right-12 bg-white shadow-card hover:shadow-card-hover" />
      </Carousel>
    </div>
  );
}