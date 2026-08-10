import { supabase } from "./supabase";

export type ParceirosSectionKey =
  | "plataformas"
  | "problema"
  | "solucao"
  | "servicos"
  | "cta_intermediario"
  | "valor_dono"
  | "processo"
  | "resultados"
  | "depoimentos"
  | "proposta"
  | "faq"
  | "contato"
  | "whatsapp_flutuante";

export const PARCEIROS_SECTION_LABELS: Record<ParceirosSectionKey, string> = {
  plataformas: "Faixa de plataformas (Airbnb, Booking.com...)",
  problema: "O Problema",
  solucao: "A Solução",
  servicos: "O Que Fazemos",
  cta_intermediario: `CTA intermediário ("Seu imóvel pode estar rendendo mais")`,
  valor_dono: "Valor para quem é dono",
  processo: "Como Funciona",
  resultados: "Resultados",
  depoimentos: "Depoimentos de proprietários",
  proposta: "Receba uma proposta (formulário de captação de leads)",
  faq: "Perguntas Frequentes",
  contato: "Rodapé / Contato",
  whatsapp_flutuante: "Botão flutuante do WhatsApp",
};

export const PARCEIROS_SECTION_KEYS = Object.keys(
  PARCEIROS_SECTION_LABELS,
) as ParceirosSectionKey[];

export type ParceirosResultado = {
  id: string;
  icon_key: string;
  // Optional on purpose: empty renders icon + label only (how the block was
  // hardcoded); filled shows the number above the label. Lets the section ship
  // before the real metrics exist.
  valor: string;
  label: string;
};

export type ParceirosDepoimento = {
  id: string;
  nome: string;
  cidade: string;
  texto: string;
};

export type ParceirosPageContent = {
  sections: Record<ParceirosSectionKey, boolean>;
  resultados: ParceirosResultado[];
  depoimentos: ParceirosDepoimento[];
};

export const PARCEIROS_RESULTADO_ICON_OPTIONS = [
  { key: "trending_up", label: "Gráfico subindo (ocupação)" },
  { key: "dollar", label: "Cifrão (rentabilidade)" },
  { key: "heart", label: "Coração (avaliações)" },
  { key: "clock", label: "Relógio (tempo livre)" },
  { key: "award", label: "Prêmio (experiência)" },
  { key: "home", label: "Casa (imóveis)" },
] as const;

// Section keys live in the shared `site_sections` table, prefixed so they don't
// collide with the /imoveis ones (which are unprefixed).
const DB_KEY_PREFIX = "parceiros_";

export function defaultParceirosSections(): Record<ParceirosSectionKey, boolean> {
  return Object.fromEntries(PARCEIROS_SECTION_KEYS.map((k) => [k, true])) as Record<
    ParceirosSectionKey,
    boolean
  >;
}

export function mapSectionRows(
  rows: { key: string; visible: boolean }[] | null | undefined,
): Record<ParceirosSectionKey, boolean> {
  const result = defaultParceirosSections();
  for (const row of rows ?? []) {
    const key = row.key.slice(DB_KEY_PREFIX.length) as ParceirosSectionKey;
    if (key in result) result[key] = row.visible;
  }
  return result;
}

export async function getParceirosContent(): Promise<ParceirosPageContent> {
  const [sectionsRes, resultadosRes, depoimentosRes] = await Promise.all([
    supabase.from("site_sections").select("key, visible").like("key", `${DB_KEY_PREFIX}%`),
    supabase.from("parceiros_resultados").select("id, icon_key, valor, label").order("sort_order"),
    supabase.from("parceiros_depoimentos").select("id, nome, cidade, texto").order("sort_order"),
  ]);

  return {
    sections: mapSectionRows(sectionsRes.data),
    resultados: (resultadosRes.data ?? []) as ParceirosResultado[],
    depoimentos: (depoimentosRes.data ?? []) as ParceirosDepoimento[],
  };
}
