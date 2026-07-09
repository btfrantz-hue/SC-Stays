import { createFileRoute, Link } from "@tanstack/react-router";
import logoAsset from "@/assets/sc-stays-logo-transparent.png";
import heroLiving from "@/assets/hero-living.jpg";
import coast from "@/assets/coast.jpg";
import { ArrowRight } from "lucide-react";

// /imoveis ainda não existe (SC-013) — usando <a> para evitar erro de tipo
const ImovelCard = ({ children, className }: { children: React.ReactNode; className: string }) => (
  <a href="/imoveis" className={className}>{children}</a>
);

export const Route = createFileRoute("/")({
  component: BifurcationHome,
  head: () => ({
    meta: [
      { title: "SC Stays Collection — Aluguel de Temporada e Gestão de Imóveis em Santa Catarina" },
      {
        name: "description",
        content:
          "Encontre imóveis de temporada em Florianópolis, SC — ou confie a gestão do seu imóvel à SC Stays Collection.",
      },
    ],
  }),
});

function BifurcationHome() {
  return (
    <div className="min-h-screen flex flex-col bg-navy relative">
      {/* Logo */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-center pt-6 pointer-events-none">
        <div className="bg-cream/95 px-5 py-3 shadow-sm pointer-events-auto">
          <img
            src={logoAsset}
            alt="SC Stays Collection"
            fetchPriority="high"
            className="h-16 w-auto"
          />
        </div>
      </div>

      {/* Split panels */}
      <div className="flex flex-1 flex-col md:flex-row min-h-screen">
        {/* Quero alugar */}
        <ImovelCard
          className="relative flex-1 group overflow-hidden flex items-center justify-center min-h-[50vh] md:min-h-screen"
        >
          <img
            src={heroLiving}
            alt="Sala de estar de imóvel de alto padrão"
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-navy/60 group-hover:bg-navy/70 transition-colors duration-300" />

          {/* Divider line on desktop */}
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-px bg-cream/20 z-10" />

          <div className="relative z-10 text-center px-8 py-16 max-w-md">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="inline-block w-10 h-px bg-gold/70" />
              <span className="text-xs tracking-[0.24em] uppercase text-gold/90">Hóspede</span>
              <span className="inline-block w-10 h-px bg-gold/70" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-cream leading-tight">
              Quero <em className="text-gold not-italic">alugar</em>
            </h2>
            <p className="mt-4 text-cream/80 text-base leading-relaxed max-w-xs mx-auto">
              Encontre o imóvel perfeito para a sua viagem em Florianópolis e região.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 border border-cream/50 text-cream text-xs tracking-[0.24em] uppercase group-hover:bg-cream group-hover:text-navy group-hover:border-cream transition-all duration-300">
              Ver imóveis
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </ImovelCard>

        {/* Sou proprietário */}
        <Link
          to="/parceiros"
          className="relative flex-1 group overflow-hidden flex items-center justify-center min-h-[50vh] md:min-h-screen"
        >
          <img
            src={coast}
            alt="Litoral de Santa Catarina ao entardecer"
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-navy/55 group-hover:bg-navy/65 transition-colors duration-300" />

          <div className="relative z-10 text-center px-8 py-16 max-w-md">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="inline-block w-10 h-px bg-gold/70" />
              <span className="text-xs tracking-[0.24em] uppercase text-gold/90">Proprietário</span>
              <span className="inline-block w-10 h-px bg-gold/70" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-cream leading-tight">
              Sou <em className="text-gold not-italic">proprietário</em>
            </h2>
            <p className="mt-4 text-cream/80 text-base leading-relaxed max-w-xs mx-auto">
              Confie a gestão do seu imóvel à SC Stays e tenha mais rentabilidade, sem complicação.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 border border-cream/50 text-cream text-xs tracking-[0.24em] uppercase group-hover:bg-cream group-hover:text-navy group-hover:border-cream transition-all duration-300">
              Ser parceiro
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </Link>
      </div>

      {/* Footer strip */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center pb-4 pointer-events-none">
        <span className="text-xs tracking-[0.2em] uppercase text-cream/30">
          Florianópolis · Santa Catarina
        </span>
      </div>
    </div>
  );
}
