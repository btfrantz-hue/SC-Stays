import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Wifi, Wind, Car, Flame, Tv, Users, BedDouble, Bath, MapPin, Phone,
  ChevronLeft, Utensils, WashingMachine, Briefcase,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getActiveProperty } from "@/lib/public-properties";
import { isFieldVisible } from "@/lib/property-fields";
import { trackWhatsappClick } from "@/lib/track-whatsapp-click";

export const Route = createFileRoute("/imoveis/$slug")({
  loader: async ({ params }) => {
    const property = await getActiveProperty(params.slug);
    if (!property) throw notFound();
    return property;
  },
  component: PropertyDetail,
  notFoundComponent: () => (
    <div className="min-h-[60vh] flex items-center justify-center bg-cream">
      <div className="text-center px-6">
        <p className="font-display text-3xl text-navy">Imóvel não encontrado.</p>
        <Link to="/imoveis" className="mt-6 inline-flex items-center gap-2 text-sm text-gold hover:underline">
          <ChevronLeft className="w-4 h-4" />
          Ver todos os imóveis
        </Link>
      </div>
    </div>
  ),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Imóvel"} — SC Stays Collection` },
      {
        name: "description",
        content: loaderData?.short_desc ?? "Imóvel para temporada gerenciado pela SC Stays Collection em Santa Catarina.",
      },
    ],
  }),
});

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "Wi-Fi": <Wifi className="w-4 h-4" />,
  "Wi-Fi ultrarrápido": <Wifi className="w-4 h-4" />,
  "Ar-condicionado": <Wind className="w-4 h-4" />,
  "Estacionamento": <Car className="w-4 h-4" />,
  "Churrasqueira": <Flame className="w-4 h-4" />,
  "TV Smart": <Tv className="w-4 h-4" />,
  "Máquina de lavar": <WashingMachine className="w-4 h-4" />,
  "Lavanderia compartilhada": <WashingMachine className="w-4 h-4" />,
  "Área de trabalho": <Briefcase className="w-4 h-4" />,
  "Cozinha equipada": <Utensils className="w-4 h-4" />,
  "Cozinha completa": <Utensils className="w-4 h-4" />,
  "Quintal privativo": <Flame className="w-4 h-4" />,
  "Piscina": <Users className="w-4 h-4" />,
};

function StatBlock({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="text-center border border-border/50 px-6 py-4 bg-cream">
      <div className="flex justify-center text-gold mb-1">{icon}</div>
      <div className="font-display text-2xl text-navy">{value}</div>
      <div className="text-xs tracking-[0.18em] uppercase text-muted-ink mt-0.5">{label}</div>
    </div>
  );
}

function PropertyDetail() {
  const property = Route.useLoaderData();

  const showNeighborhood = isFieldVisible(property.visible_fields, "neighborhood") && property.neighborhood;
  const showBedrooms = isFieldVisible(property.visible_fields, "bedrooms") && property.bedrooms != null;
  const showBathrooms = isFieldVisible(property.visible_fields, "bathrooms") && property.bathrooms != null;
  const showMaxGuests = isFieldVisible(property.visible_fields, "max_guests") && property.max_guests != null;
  const showDescription = isFieldVisible(property.visible_fields, "description") && property.description;
  const showAmenities = isFieldVisible(property.visible_fields, "amenities") && property.amenities && property.amenities.length > 0;
  const hasStats = showBedrooms || showBathrooms || showMaxGuests;

  const waMsg = encodeURIComponent(
    `Olá! Vi o imóvel "${property.name}" (${property.neighborhood}, ${property.city}) no site da SC Stays e gostaria de saber mais sobre disponibilidade.`
  );
  const waUrl = `https://wa.me/5548991822477?text=${waMsg}`;

  return (
    <div className="min-h-screen bg-cream">
      {/* Back link */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8">
        <Link
          to="/imoveis"
          className="inline-flex items-center gap-2 text-sm text-muted-ink hover:text-gold transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Todos os imóveis
        </Link>
      </div>

      {/* Photo carousel */}
      <div className="mt-6 max-w-7xl mx-auto px-6 lg:px-12">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {property.images.map((img, i) => (
              <CarouselItem key={i}>
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={img}
                    alt={`${property.name} — foto ${i + 1}`}
                    loading={i === 0 ? "eager" : "lazy"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-cream/90 border-border text-navy hover:bg-cream" />
          <CarouselNext className="right-4 bg-cream/90 border-border text-navy hover:bg-cream" />
        </Carousel>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 grid lg:grid-cols-3 gap-12">
        {/* Left — details */}
        <div className="lg:col-span-2">
          {/* Location */}
          <div className="flex items-center gap-2 text-muted-ink/70 text-xs mb-3">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {showNeighborhood ? `${property.neighborhood}, ` : ""}
            {property.city} — {property.state}
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl text-navy leading-tight">
            {property.name}
          </h1>

          {/* Stats */}
          {hasStats && (
            <div className="mt-6 grid grid-cols-3 gap-3">
              {showBedrooms && (
                <StatBlock
                  icon={<BedDouble className="w-5 h-5" />}
                  value={property.bedrooms!}
                  label={property.bedrooms === 1 ? "Quarto" : "Quartos"}
                />
              )}
              {showBathrooms && (
                <StatBlock
                  icon={<Bath className="w-5 h-5" />}
                  value={property.bathrooms!}
                  label={property.bathrooms === 1 ? "Banheiro" : "Banheiros"}
                />
              )}
              {showMaxGuests && (
                <StatBlock
                  icon={<Users className="w-5 h-5" />}
                  value={property.max_guests!}
                  label={property.max_guests === 1 ? "Pessoa" : "Pessoas"}
                />
              )}
            </div>
          )}

          {/* Description */}
          {showDescription && (
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-block w-6 h-px bg-gold" />
                <span className="eyebrow">Sobre o imóvel</span>
              </div>
              <p className="text-muted-ink leading-relaxed text-base">{property.description}</p>
            </div>
          )}

          {/* Amenities */}
          {showAmenities && (
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-block w-6 h-px bg-gold" />
                <span className="eyebrow">O que tem no imóvel</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities!.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2.5 text-sm text-navy border border-border/50 px-3 py-2.5 bg-cream">
                    <span className="text-gold shrink-0">
                      {AMENITY_ICONS[amenity] ?? <span className="w-4 h-4 inline-block rounded-full border border-gold/50" />}
                    </span>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — sticky CTA */}
        <div className="lg:col-span-1">
          <div className="slide-frame p-6 sticky top-28">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block w-5 h-px bg-gold" />
              <span className="eyebrow text-xs">Tenho interesse</span>
            </div>
            <p className="font-display text-xl text-navy leading-snug">
              Quer saber sobre disponibilidade?
            </p>
            <p className="mt-2 text-sm text-muted-ink leading-relaxed">
              Fale diretamente com a SC Stays no WhatsApp. Respondemos rápido.
            </p>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsappClick({ page: "imoveis_slug", button: "detalhe_imovel", propertySlug: property.slug })}
              className="mt-6 flex items-center justify-center gap-2 w-full py-3.5 text-xs tracking-[0.24em] uppercase font-medium text-white transition"
              style={{ backgroundColor: "#25D366" }}
            >
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Falar no WhatsApp
            </a>

            <div className="mt-4 text-center text-xs text-muted-ink/60">
              Sem custos, sem compromisso.
            </div>
            <div className="slide-frame-band" />
          </div>

          {/* Trust note */}
          <p className="mt-6 text-xs text-muted-ink/60 text-center leading-relaxed">
            Imóvel gerenciado pela{" "}
            <Link to="/parceiros" className="text-gold hover:underline">
              SC Stays Collection
            </Link>
            {" "}— gestão profissional de temporada em Santa Catarina.
          </p>
        </div>
      </div>
    </div>
  );
}
