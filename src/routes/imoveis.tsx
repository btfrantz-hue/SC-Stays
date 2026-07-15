import { createFileRoute, Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Users, BedDouble, Bath, MapPin, Phone, ChevronLeft, ChevronRight, Star, Quote, Award, Clock, HeartHandshake, Home } from "lucide-react";
import { listActiveProperties, type PublicProperty } from "@/lib/public-properties";
import { isFieldVisible } from "@/lib/property-fields";
import { trackWhatsappClick } from "@/lib/track-whatsapp-click";
import { getImoveisPageContent, type ImoveisPageContent } from "@/lib/site-content";

const RESULTADO_ICONS: Record<string, React.ReactNode> = {
  award: <Award className="w-5 h-5" />,
  home: <Home className="w-5 h-5" />,
  clock: <Clock className="w-5 h-5" />,
  heart: <HeartHandshake className="w-5 h-5" />,
};

export const Route = createFileRoute("/imoveis")({
  component: ImoveisRoot,
  loader: async () => {
    const [properties, content] = await Promise.all([listActiveProperties(), getImoveisPageContent()]);
    return { properties, content };
  },
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

function PropertyCard({ property }: { property: PublicProperty }) {
  const showNeighborhood = isFieldVisible(property.visible_fields, "neighborhood") && property.neighborhood;
  const showShortDesc = isFieldVisible(property.visible_fields, "short_desc") && property.short_desc;
  const showBedrooms = isFieldVisible(property.visible_fields, "bedrooms") && property.bedrooms != null;
  const showBathrooms = isFieldVisible(property.visible_fields, "bathrooms") && property.bathrooms != null;
  const showMaxGuests = isFieldVisible(property.visible_fields, "max_guests") && property.max_guests != null;

  return (
    <div className="slide-frame group flex flex-col overflow-hidden">
      <CardImageSlider images={property.images} name={property.name} city={property.city} />

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start gap-2 text-muted-ink/70 text-xs mb-2">
          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          {showNeighborhood ? `${property.neighborhood}, ` : ""}
          {property.city} — {property.state}
        </div>

        <h2 className="font-display text-xl text-navy leading-snug">{property.name}</h2>

        {showShortDesc && (
          <p className="mt-2 text-sm text-muted-ink leading-relaxed line-clamp-2 flex-1">
            {property.short_desc}
          </p>
        )}

        {/* Stats */}
        <div className="mt-4 flex flex-wrap gap-4 border-t border-border/50 pt-4">
          {showBedrooms && (
            <StatBadge icon={<BedDouble className="w-3.5 h-3.5" />} label={`${property.bedrooms} ${property.bedrooms === 1 ? "quarto" : "quartos"}`} />
          )}
          {showBathrooms && (
            <StatBadge icon={<Bath className="w-3.5 h-3.5" />} label={`${property.bathrooms} ${property.bathrooms === 1 ? "banheiro" : "banheiros"}`} />
          )}
          {showMaxGuests && (
            <StatBadge icon={<Users className="w-3.5 h-3.5" />} label={`até ${property.max_guests} pessoas`} />
          )}
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

// ─── Sub-navigation ───────────────────────────────────────────────────────────

function buildNavSections(sections: ImoveisPageContent["sections"]) {
  return [
    { id: "imoveis", label: "Imóveis", show: sections.catalogo },
    { id: "resultados", label: "Resultados", show: sections.resultados },
    { id: "avaliacoes", label: "Avaliações", show: sections.notas_apps },
    { id: "depoimentos", label: "Depoimentos", show: sections.depoimentos },
  ].filter((s) => s.show);
}

function SubNav({ sections }: { sections: ReturnType<typeof buildNavSections> }) {
  const [active, setActive] = useState(sections[0]?.id ?? "imoveis");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach(({ id }) => {
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
  }, [sections]);

  return (
    <nav className="sticky top-[81px] z-40 bg-cream border-b border-border/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex overflow-x-auto scrollbar-none gap-0">
          {sections.map(({ id, label }) => (
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
  const { properties, content } = Route.useLoaderData();
  const navSections = buildNavSections(content.sections);

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

      <SubNav sections={navSections} />

      {/* ── Imóveis ─────────────────────────────────────────────────────────── */}
      {content.sections.catalogo && (
        <section id="imoveis" className="max-w-7xl mx-auto px-6 lg:px-12 pt-14 lg:pt-20 pb-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
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
              onClick={() => trackWhatsappClick({ page: "imoveis", button: "catalogo_geral" })}
              className="mt-6 inline-flex items-center gap-2 px-7 py-3 text-xs tracking-[0.24em] uppercase bg-navy text-cream hover:bg-navy-deep transition"
            >
              <Phone className="w-4 h-4" />
              Falar no WhatsApp
            </a>
          </div>
        </section>
      )}

      {/* ── Resultados ──────────────────────────────────────────────────────── */}
      {content.sections.resultados && (
        <section id="resultados" className="bg-navy py-16 lg:py-20 scroll-mt-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center gap-4 mb-3">
              <span className="inline-block w-8 h-px bg-gold" />
              <span className="eyebrow">Resultados</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-cream leading-tight max-w-xl mb-10">
              Uma gestão que você pode confiar.
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {content.resultados.map((r) => (
                <div key={r.id} className="border border-cream/15 p-6">
                  <div className="text-gold mb-3">{RESULTADO_ICONS[r.icon_key] ?? RESULTADO_ICONS.award}</div>
                  <div className="font-display text-3xl text-cream leading-none">{r.valor}</div>
                  <div className="mt-1.5 text-xs text-cream/60 leading-snug">{r.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Avaliações nos aplicativos ──────────────────────────────────────── */}
      {content.sections.notas_apps && (
        <section id="avaliacoes" className="py-16 lg:py-20 bg-cream-deep/40 scroll-mt-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center gap-4 mb-3">
              <span className="inline-block w-8 h-px bg-gold" />
              <span className="eyebrow">Notas nos aplicativos</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-navy leading-tight max-w-xl mb-10">
              Avaliados pelos próprios hóspedes.
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 max-w-2xl">
              {content.appRatings.map((r) => (
                <div key={r.id} className="slide-frame p-6 text-center">
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
        </section>
      )}

      {/* ── Depoimentos ─────────────────────────────────────────────────────── */}
      {content.sections.depoimentos && (
        <section id="depoimentos" className="py-16 lg:py-20 scroll-mt-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center gap-4 mb-3">
              <span className="inline-block w-8 h-px bg-gold" />
              <span className="eyebrow">Depoimentos</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-navy leading-tight max-w-xl mb-10">
              O que os hóspedes dizem sobre a experiência SC Stays.
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {content.depoimentos.map((d) => (
                <div key={d.id} className="slide-frame p-6 flex flex-col">
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
        </section>
      )}
    </div>
  );
}
