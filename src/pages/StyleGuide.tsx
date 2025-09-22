import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";

const ColorSample = ({ color, name }: { color: string; name: string }) => (
  <div className="p-4 rounded-lg shadow-card text-center">
    <div className={`w-full h-20 rounded ${color} mb-2 border border-border`}></div>
    <p className="font-semibold text-card-foreground">{name}</p>
  </div>
);

const StyleGuide = () => {
  return (
    <div className="bg-background text-foreground p-8">
      <h1 className="text-4xl font-bold mb-4">Style Guide</h1>
      <p className="text-muted-foreground mb-8">
        Esta página demonstra os elementos visuais e componentes do novo Design
        System.
      </p>

      {/* Seção de Cores */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 border-b-2 border-border pb-2">
          Paleta de Cores
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Cores Primárias */}
          <ColorSample color="bg-primary" name="Primary" />
          <ColorSample color="bg-primary-foreground" name="Primary Foreground" />

          {/* Cores Secundárias */}
          <ColorSample color="bg-secondary" name="Secondary" />
          <ColorSample
            color="bg-secondary-foreground"
            name="Secondary Foreground"
          />

          {/* Cores de Destaque */}
          <ColorSample color="bg-accent" name="Accent" />
          <ColorSample color="bg-accent-foreground" name="Accent Foreground" />

          {/* Cores de Fundo e Texto */}
          <ColorSample color="bg-background" name="Background" />
          <ColorSample color="bg-foreground" name="Foreground" />

          {/* Cores de Feedback */}
          <ColorSample color="bg-destructive" name="Destructive" />
          <ColorSample
            color="bg-destructive-foreground"
            name="Destructive Foreground"
          />
          <ColorSample color="bg-success" name="Success" />
          <ColorSample color="bg-warning" name="Warning" />
          <ColorSample color="bg-info" name="Info" />

          {/* Outras */}
          <ColorSample color="bg-muted" name="Muted" />
          <ColorSample color="bg-muted-foreground" name="Muted Foreground" />
          <ColorSample color="bg-card" name="Card" />
          <ColorSample color="bg-card-foreground" name="Card Foreground" />
          <ColorSample color="bg-popover" name="Popover" />
          <ColorSample
            color="bg-popover-foreground"
            name="Popover Foreground"
          />
        </div>
      </section>

      {/* Seção de Tipografia */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 border-b-2 border-border pb-2">
          Tipografia
        </h2>
        <div className="space-y-4">
          <p className="text-6xl font-bold">Display (6xl, bold)</p>
          <p className="text-5xl font-semibold">Heading 1 (5xl, semibold)</p>
          <p className="text-4xl font-semibold">Heading 2 (4xl, semibold)</p>
          <p className="text-3xl font-medium">Heading 3 (3xl, medium)</p>
          <p className="text-2xl font-medium">Heading 4 (2xl, medium)</p>
          <p className="text-xl">Lead (xl)</p>
          <p className="text-lg">Body Large (lg)</p>
          <p>Body (base)</p>
          <p className="text-sm text-muted-foreground">Small / Muted (sm)</p>
          <p className="text-xs text-muted-foreground">Extra Small (xs)</p>
        </div>
      </section>

      {/* Seção de Botões */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 border-b-2 border-border pb-2">
          Botões
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      {/* Seção de Badges */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 border-b-2 border-border pb-2">
          Badges
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="premium">Premium</Badge>
        </div>
      </section>

      {/* Seção de Cards */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 border-b-2 border-border pb-2">
          Cards
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 rounded-lg card-shadow bg-card">
            <h3 className="text-xl font-semibold mb-2">Card Padrão</h3>
            <p className="text-muted-foreground">
              Este é um card com a sombra padrão. Use para agrupar conteúdo de
              forma limpa e organizada.
            </p>
          </div>
          <div className="p-6 rounded-lg premium-shadow bg-gradient-premium text-primary-foreground">
            <h3 className="text-xl font-semibold mb-2">Card Premium</h3>
            <p>
              Este card usa a sombra e o gradiente premium para maior destaque.
              Ideal para CTAs importantes.
            </p>
          </div>
        </div>
      </section>

      {/* Seção de SectionHeader */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 border-b-2 border-border pb-2">
          Section Headers
        </h2>
        <div className="space-y-8">
          <SectionHeader
            title="Título Alinhado à Esquerda"
            subtitle="Este é um subtítulo para descrever a seção. O alinhamento padrão é à esquerda."
          />
          <SectionHeader
            title="Título Centralizado com Badge"
            subtitle="Este subtítulo é um pouco mais longo para demonstrar como o texto se comporta em múltiplas linhas."
            badge={<Badge variant="premium">Novo</Badge>}
            align="center"
          />
          <SectionHeader
            title="Título Alinhado à Direita"
            align="right"
          />
        </div>
      </section>

      {/* Seção de Backgrounds e Gradientes */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 border-b-2 border-border pb-2">
          Backgrounds e Gradientes
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="h-40 rounded-lg bg-hero-pattern border flex items-center justify-center">
            <p className="text-lg font-medium">Hero Pattern</p>
          </div>
          <div className="h-40 rounded-lg bg-gradient-gold flex items-center justify-center">
            <p className="text-lg font-medium text-white">Gold Gradient</p>
          </div>
          <div className="h-40 rounded-lg bg-gradient-accent flex items-center justify-center">
            <p className="text-lg font-medium text-white">Accent Gradient</p>
          </div>
          <div className="h-40 rounded-lg bg-gradient-premium flex items-center justify-center">
            <p className="text-lg font-medium text-primary-foreground">
              Premium Gradient
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StyleGuide;