import { supabase } from "./supabase";

export type SiteSectionKey = "catalogo" | "resultados" | "notas_apps" | "depoimentos";

export type ResultadoCard = {
  id: string;
  icon_key: string;
  valor: string;
  label: string;
};

export type AppRating = {
  id: string;
  plataforma: string;
  nota: number;
  max: number;
  display: string;
};

export type Depoimento = {
  id: string;
  nome: string;
  origem: string;
  texto: string;
};

export type ImoveisPageContent = {
  sections: Record<SiteSectionKey, boolean>;
  resultados: ResultadoCard[];
  appRatings: AppRating[];
  depoimentos: Depoimento[];
};

export const RESULTADO_ICON_OPTIONS = [
  { key: "award", label: "Prêmio (experiência)" },
  { key: "home", label: "Casa (imóveis)" },
  { key: "clock", label: "Relógio (suporte)" },
  { key: "heart", label: "Coração (atendimento)" },
] as const;

const DEFAULT_SECTIONS: Record<SiteSectionKey, boolean> = {
  catalogo: true,
  resultados: true,
  notas_apps: true,
  depoimentos: true,
};

export async function getImoveisPageContent(): Promise<ImoveisPageContent> {
  const [sectionsRes, resultadosRes, ratingsRes, depoimentosRes] = await Promise.all([
    supabase.from("site_sections").select("key, visible"),
    supabase.from("resultado_cards").select("id, icon_key, valor, label").order("sort_order"),
    supabase.from("app_ratings").select("id, plataforma, nota, max, display").order("sort_order"),
    supabase.from("depoimentos").select("id, nome, origem, texto").order("sort_order"),
  ]);

  const sections = { ...DEFAULT_SECTIONS };
  for (const row of sectionsRes.data ?? []) {
    if (row.key in sections) sections[row.key as SiteSectionKey] = row.visible;
  }

  return {
    sections,
    resultados: (resultadosRes.data ?? []) as ResultadoCard[],
    appRatings: (ratingsRes.data ?? []) as AppRating[],
    depoimentos: (depoimentosRes.data ?? []) as Depoimento[],
  };
}
