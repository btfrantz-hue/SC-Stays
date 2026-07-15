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
  proposta: "Receba uma proposta (formulário de captação de leads)",
  faq: "Perguntas Frequentes",
  contato: "Rodapé / Contato",
  whatsapp_flutuante: "Botão flutuante do WhatsApp",
};

export const PARCEIROS_SECTION_KEYS = Object.keys(PARCEIROS_SECTION_LABELS) as ParceirosSectionKey[];

const DB_KEY_PREFIX = "parceiros_";

function defaults(): Record<ParceirosSectionKey, boolean> {
  return Object.fromEntries(PARCEIROS_SECTION_KEYS.map((k) => [k, true])) as Record<ParceirosSectionKey, boolean>;
}

export async function getParceirosSections(): Promise<Record<ParceirosSectionKey, boolean>> {
  const { data } = await supabase.from("site_sections").select("key, visible").like("key", `${DB_KEY_PREFIX}%`);
  const result = defaults();
  for (const row of data ?? []) {
    const key = row.key.slice(DB_KEY_PREFIX.length) as ParceirosSectionKey;
    if (key in result) result[key] = row.visible;
  }
  return result;
}
