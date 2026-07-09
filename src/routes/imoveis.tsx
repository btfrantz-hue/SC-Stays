import { createFileRoute, Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Users, BedDouble, Bath, MapPin, Phone, ChevronLeft, ChevronRight, Star, Quote, Award, Clock, HeartHandshake, Home } from "lucide-react";
import { MOCK_PROPERTIES } from "@/lib/mock-properties";
import { FLAGS } from "@/lib/feature-flags";

export const Route = createFileRoute("/imoveis")({
  component: ImoveisRoot,
  head: () => ({
    meta: [
      { title: "Imóveis para Temporada em Florianópolis — SC Stays Collection" },
      {
        name: "description",
        content:
          "Encontre imóveis selecionados para alugar em Florianópolis, SC. Praias, lagoas e centro — todos com gestão profissional SC Stays.",
      },
    ],
  }),
});

const WA_CATALOG = `https://wa.me/5548991822477?text=${encodeURIComponent(
  "Olá! Estou procurando um imóvel para temporada em Florianópolis e gostaria de mais informações."
)}`;

function StatBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-ink">
      {icon}
      {label}
    </span>
  );
}

function CardImageSlider({ images, name, city }: { images: string[]; name: string; city: string }) {
  const [active, setActive] = useState(0);

  function go(dir: 1 | -1, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setActive((i) => (i + dir + images.length) % images.length);
  }

  function dot(i: number, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setActive(i);
  }

  return (
    <div className="relative overflow-hidden aspect-[4/3] group/slider">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`${name} — foto ${i + 1}`}
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            i === active ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />
      ))}

      {/* City badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="bg-navy text-cream text-xs tracking-[0.18em] uppercase px-3 py-1">
          {city}
        </span>
      </div>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute top-3 right-3 z-10 bg-navy/60 text-cream text-xs px-2 py-0.5 tracking-wide">
          {active + 1}/{images.length}
        </div>
      )}

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => go(-1, e)}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-cream/85 text-navy flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-200 hover:bg-cream"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => go(1, e)}
            aria-label="Próxima foto"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-cream/85 text-navy flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-200 hover:bg-cream"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2.5 left-0 right-0 z-10 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => dot(i, e)}
              aria-label={`Foto ${i + 1}`}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                i === active ? "bg-cream scale-125" : "bg-cream/45 hover:bg-cream/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PropertyCard({ property }: { property: (typeof MOCK_PROPERTIES)[number] }) {
  return (
    <div className="slide-frame group flex flex-col overflow-hidden">
      <CardImageSlider images={property.images} name={property.name} city={property.city} />

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start gap-2 text-muted-ink/70 text-xs mb-2">
          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          {property.neighborhood}, {property.city} — {property.state}
        </div>

        <h2 className="font-display text-xl text-navy leading-snug">{property.name}</h2>

        <p className="mt-2 text-sm text-muted-ink leading-relaxed line-clamp-2 flex-1">
          {property.shortDesc}
        </p>

        {/* Stats */}
        <div className="mt-4 flex flex-wrap gap-4 border-t border-border/50 pt-4">
          <StatBadge icon={<BedDouble className="w-3.5 h-3.5" />} label={`${property.bedrooms} ${property.bedrooms === 1 ? "quarto" : "quartos"}`} />
          <StatBadge icon={<Bath className="w-3.5 h-3.5" />} label={`${property.bathrooms} ${property.bathrooms === 1 ? "banheiro" : "banheiros"}`} />
          <StatBadge icon={<Users className="w-3.5 h-3.5" />} label={`até ${property.maxGuests} pessoas`} />
        </div>

        {/* CTA */}
        <Link
          to="/imoveis/$slug"
          params={{ slug: property.slug }}
          className="mt-5 inline-flex items-center justify-center px-5 py-2.5 text-xs tracking-[0.24em] uppercase bg-navy text-cream hover:bg-navy-deep transition w-full"
        >
          Ver detalhes
        </Link>
      </div>

      <div className="slide-frame-band" />
    </div>
  );
}

function ImoveisRoot() {
  const matchRoute = useMatchRoute();
  const isExact = matchRoute({ to: "/imoveis" });
  if (isExact) return <ImovelsCatalog />;
  return <Outlet />;
}

// ─── Static data (replace with real content when available) ──────────────────

const RESULTADOS = [
  { icon: <Award className="w-5 h-5" />, valor: "10 anos", label: "de experiência no mercado" },
  { icon: <Home className="w-5 h-5" />, valor: "100%", label: "imóveis verificados e vistoriados" },
  { icon: <Clock className="w-5 h-5" />, valor: "24h", label: "de suporte ao hóspede" },
  { icon: <HeartHandshake className="w-5 h-5" />, valor: "Dedicado", label: "atendimento personalizado" },
];

const APP_RATINGS = [
  { plataforma: "Airbnb", nota: 4.9, max: 5, display: "4,9 / 5,0" },
  { plataforma: "Booking.com", nota: 9.4, max: 10, display: "9,4 / 10" },
  { plataforma: "Google", nota: 4.8, max: 5, display: "4,8 / 5,0" },
];

const DEPOIMENTOS = [
  {
    nome: "Ana S.",
    origem: "São Paulo, SP",
    texto:
      "Check-in super fácil e a equipe respondeu em minutos quando tive uma dúvida. O apartamento estava impecável, exatamente como nas fotos. Com certeza reservo de novo.",
  },
  {
    nome: "Carlos M.",
    origem: "Curitiba, PR",
    texto:
      "Já é a terceira vez que fico em um imóvel gerenciado pela SC Stays. A comunicação é sempre rápida e eles resolvem qualquer coisa antes de virar problema.",
  },
  {
    nome: "Família Rodrigues",
    origem: "Porto Alegre, RS",
    texto:
      "Ficamos uma semana e tudo funcionou perfeitamente. Casa muito bem cuidada, comunicação excelente do início ao fim e suporte sempre disponível.",
  },
];

// ─── Sub-navigation ───────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { id: "imoveis", label: "Imóveis", show: true },
  { id: "resultados", label: "Resultados", show: FLAGS.RESULTADOS_IMOVEIS },
  { id: "avaliacoes", label: "Avaliações", show: FLAGS.NOTAS_APPS },
  { id: "depoimentos", label: "Depoimentos", show: FLAGS.DEPOIMENTOS_HOSPEDES },
].filter((s) => s.show);

function SubNav() {
  const [active, setActive] = useState("imoveis");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <nav className="sticky top-[81px] z-40 bg-cream border-b border-border/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex overflow-x-auto scrollbar-none gap-0">
          {NAV_SECTIONS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`shrink-0 py-3.5 px-5 text-xs tracking-[0.2em] uppercase border-b-2 transition-colors ${
                active === id
                  ? "border-gold text-navy font-medium"
                  : "border-transparent text-muted-ink hover:text-navy"
              }`}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ─── Stars helper ─────────────────────────────────────────────────────────────

function Stars({ nota, max }: { nota: number; max: number }) {
  const normalized = (nota / max) * 5;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= Math.round(normalized) ? "fill-gold text-gold" : "fill-border text-border"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Main catalog ─────────────────────────────────────────────────────────────

function ImovelsCatalog() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-navy py-14 lg:py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <span className="inline-block w-8 h-px bg-gold" />
            <span className="eyebrow">Imóveis disponíveis</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-cream leading-tight max-w-2xl">
            Encontre o imóvel perfeito para a sua temporada.
          </h1>
          <p className="mt-4 text-cream/70 max-w-xl text-base leading-relaxed">
            Todos os imóveis são gerenciados pela SC Stays Collection — selecionados, bem cuidados
            e prontos para receber você em Florianópolis, SC.
          </p>
        </div>
      </div>

      <SubNav />

      {/* ── Imóveis ─────────────────────────────────────────────────────────── */}
      <section id="imoveis" className="max-w-7xl mx-auto px-6 lg:px-12 pt-14 lg:pt-20 pb-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_PROPERTIES.map((property) => (
            <PropertyCard key={property.slug} property={property} />
          ))}
        </div>

        <div className="mt-12 border-t border-border/50 pt-10 text-center">
          <p className="font-display text-2xl text-navy">Não encontrou o que procura?</p>
          <p className="mt-2 text-muted-ink text-sm max-w-md mx-auto">
            Fale com a gente no WhatsApp e te ajudamos a encontrar a opção ideal.
          </p>
          <a
            href={WA_CATALOG}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 px-7 py-3 text-xs tracking-[0.24em] uppercase bg-navy text-cream hover:bg-navy-deep transition"
          >
            <Phone className="w-4 h-4" />
            Falar no WhatsApp
          </a>
        </div>
      </section>

      {/* ── Resultados ──────────────────────────────────────────────────────── */}
      {FLAGS.RESULTADOS_IMOVEIS && <section id="resultados" className="bg-navy py-16 lg:py-20 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-4 mb-3">
            <span className="inline-block w-8 h-px bg-gold" />
            <span className="eyebrow">Resultados</span>
            <span className="text-[10px] tracking-[0.15em] uppercase border border-dashed border-gold/40 text-gold/50 px-1.5 py-0.5">exemplo</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-cream leading-tight max-w-xl mb-10">
            Uma gestão que você pode confiar.
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {RESULTADOS.map((r) => (
              <div key={r.label} className="border border-cream/15 p-6">
                <div className="text-gold mb-3">{r.icon}</div>
                <div className="font-display text-3xl text-cream leading-none">{r.valor}</div>
                <div className="mt-1.5 text-xs text-cream/60 leading-snug">{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>}

      {/* ── Avaliações nos aplicativos ──────────────────────────────────────── */}
      {FLAGS.NOTAS_APPS && <section id="avaliacoes" className="py-16 lg:py-20 bg-cream-deep/40 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-4 mb-3">
            <span className="inline-block w-8 h-px bg-gold" />
            <span className="eyebrow">Notas nos aplicativos</span>
            <span className="text-[10px] tracking-[0.15em] uppercase border border-dashed border-navy/30 text-navy/40 px-1.5 py-0.5">exemplo</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-navy leading-tight max-w-xl mb-10">
            Avaliados pelos próprios hóspedes.
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 max-w-2xl">
            {APP_RATINGS.map((r) => (
              <div key={r.plataforma} className="slide-frame p-6 text-center">
                <div className="text-xs tracking-[0.2em] uppercase text-muted-ink mb-3">
                  {r.plataforma}
                </div>
                <div className="font-display text-4xl text-navy leading-none">{r.display}</div>
                <div className="mt-3 flex justify-center">
                  <Stars nota={r.nota} max={r.max} />
                </div>
                <div className="slide-frame-band" />
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-ink/60">
            Média consolidada das avaliações de hóspedes nas plataformas.
          </p>
        </div>
      </section>}

      {/* ── Depoimentos ─────────────────────────────────────────────────────── */}
      {FLAGS.DEPOIMENTOS_HOSPEDES && <section id="depoimentos" className="py-16 lg:py-20 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-4 mb-3">
            <span className="inline-block w-8 h-px bg-gold" />
            <span className="eyebrow">Depoimentos</span>
            <span className="text-[10px] tracking-[0.15em] uppercase border border-dashed border-navy/30 text-navy/40 px-1.5 py-0.5">exemplo</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-navy leading-tight max-w-xl mb-10">
            O que os hóspedes dizem sobre a experiência SC Stays.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {DEPOIMENTOS.map((d) => (
              <div key={d.nome} className="slide-frame p-6 flex flex-col">
                <Quote className="w-5 h-5 text-gold/60 mb-4 shrink-0" />
                <p className="text-sm text-muted-ink leading-relaxed flex-1">"{d.texto}"</p>
                <div className="mt-5 pt-4 border-t border-border/50">
                  <div className="text-sm font-medium text-navy">{d.nome}</div>
                  <div className="text-xs text-muted-ink/60 mt-0.5">{d.origem}</div>
                </div>
                <div className="slide-frame-band" />
              </div>
            ))}
          </div>
        </div>
      </section>}
    </div>
  );
}
