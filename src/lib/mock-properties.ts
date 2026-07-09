import heroLiving from "@/assets/hero-living.jpg";
import bedroom from "@/assets/bedroom.jpg";
import coast from "@/assets/coast.jpg";

export type Property = {
  slug: string;
  name: string;
  neighborhood: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  shortDesc: string;
  description: string;
  amenities: string[];
  images: string[];
};

export const MOCK_PROPERTIES: Property[] = [
  {
    slug: "apartamento-beira-mar-ingleses",
    name: "Apartamento Beira-Mar Ingleses",
    neighborhood: "Ingleses",
    city: "Florianópolis",
    state: "SC",
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 5,
    shortDesc:
      "A poucos metros da praia de Ingleses, com vista para o mar e condomínio completo com piscina.",
    description:
      "Apartamento espaçoso e aconchegante a apenas 200 metros da Praia de Ingleses. Conta com sala integrada à varanda com vista para o mar, cozinha totalmente equipada, dois quartos (suíte e casal) e acesso a condomínio com piscina, churrasqueira e estacionamento. Perfeito para famílias ou casais que buscam tranquilidade e conforto na Ilha da Magia.",
    amenities: [
      "Wi-Fi",
      "Ar-condicionado",
      "Cozinha equipada",
      "Estacionamento",
      "Piscina",
      "Churrasqueira",
      "TV Smart",
      "Máquina de lavar",
    ],
    images: [heroLiving, bedroom, coast],
  },
  {
    slug: "casa-lagoa-da-conceicao",
    name: "Casa na Lagoa da Conceição",
    neighborhood: "Lagoa da Conceição",
    city: "Florianópolis",
    state: "SC",
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    shortDesc:
      "Casa charmosa com área gourmet e quintal privativo, a 5 minutos da orla da Lagoa.",
    description:
      "Casa aconchegante com três quartos, área gourmet com churrasqueira e quintal privativo. Localizada em rua tranquila, a 5 minutos da orla da Lagoa da Conceição, rodeada de bares, restaurantes e esportes náuticos. Ideal para grupos e famílias que buscam privacidade e conveniência no coração de Florianópolis.",
    amenities: [
      "Wi-Fi",
      "Ar-condicionado",
      "Cozinha completa",
      "Churrasqueira",
      "Quintal privativo",
      "Estacionamento",
      "TV Smart",
      "Máquina de lavar",
    ],
    images: [bedroom, heroLiving, coast],
  },
  {
    slug: "flat-executivo-centro-florianopolis",
    name: "Flat Executivo Centro",
    neighborhood: "Centro",
    city: "Florianópolis",
    state: "SC",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    shortDesc:
      "Flat moderno e bem localizado no centro de Florianópolis, ideal para viajantes a trabalho ou casais.",
    description:
      "Flat compacto e funcional no centro de Florianópolis, com acesso fácil às principais atrações, serviços e vias da cidade. Perfeito para estadias de trabalho ou casais que buscam praticidade e boa localização. Equipado com área de trabalho e internet ultrarrápida.",
    amenities: [
      "Wi-Fi ultrarrápido",
      "Ar-condicionado",
      "Cozinha equipada",
      "Estacionamento",
      "TV Smart",
      "Área de trabalho",
      "Lavanderia compartilhada",
    ],
    images: [coast, bedroom, heroLiving],
  },
];
