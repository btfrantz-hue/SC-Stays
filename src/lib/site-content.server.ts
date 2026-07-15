import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createSupabaseServerClient } from "./supabase.server";
import { requireAdminMiddleware } from "./admin-auth.server";
import type { ImoveisPageContent } from "./site-content";

const sectionsSchema = z.object({
  catalogo: z.boolean(),
  resultados: z.boolean(),
  notas_apps: z.boolean(),
  depoimentos: z.boolean(),
});

const resultadoCardSchema = z.object({
  id: z.string(),
  icon_key: z.string().min(1),
  valor: z.string().min(1),
  label: z.string().min(1),
});

const appRatingSchema = z.object({
  id: z.string(),
  plataforma: z.string().min(1),
  nota: z.number(),
  max: z.number(),
  display: z.string().min(1),
});

const depoimentoSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1),
  origem: z.string().min(1),
  texto: z.string().min(1),
});

const saveSiteConfigSchema = z.object({
  sections: sectionsSchema,
  resultados: z.array(resultadoCardSchema),
  appRatings: z.array(appRatingSchema),
  depoimentos: z.array(depoimentoSchema),
});

export const getAdminSiteConfig = createServerFn({ method: "GET" })
  .middleware([requireAdminMiddleware])
  .handler(async (): Promise<ImoveisPageContent> => {
    const supabase = createSupabaseServerClient();
    const [sectionsRes, resultadosRes, ratingsRes, depoimentosRes] = await Promise.all([
      supabase.from("site_sections").select("key, visible"),
      supabase.from("resultado_cards").select("id, icon_key, valor, label").order("sort_order"),
      supabase.from("app_ratings").select("id, plataforma, nota, max, display").order("sort_order"),
      supabase.from("depoimentos").select("id, nome, origem, texto").order("sort_order"),
    ]);

    if (sectionsRes.error) throw new Error(sectionsRes.error.message);
    if (resultadosRes.error) throw new Error(resultadosRes.error.message);
    if (ratingsRes.error) throw new Error(ratingsRes.error.message);
    if (depoimentosRes.error) throw new Error(depoimentosRes.error.message);

    const sections = { catalogo: true, resultados: true, notas_apps: true, depoimentos: true };
    for (const row of sectionsRes.data ?? []) {
      if (row.key in sections) (sections as Record<string, boolean>)[row.key] = row.visible;
    }

    return {
      sections,
      resultados: resultadosRes.data ?? [],
      appRatings: ratingsRes.data ?? [],
      depoimentos: depoimentosRes.data ?? [],
    };
  });

export const saveSiteConfig = createServerFn({ method: "POST" })
  .middleware([requireAdminMiddleware])
  .validator((data: unknown) => saveSiteConfigSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();

    for (const [key, visible] of Object.entries(data.sections)) {
      const { error } = await supabase.from("site_sections").update({ visible }).eq("key", key);
      if (error) throw new Error(error.message);
    }

    for (const card of data.resultados) {
      const { error } = await supabase
        .from("resultado_cards")
        .update({ icon_key: card.icon_key, valor: card.valor, label: card.label })
        .eq("id", card.id);
      if (error) throw new Error(error.message);
    }

    for (const rating of data.appRatings) {
      const { error } = await supabase
        .from("app_ratings")
        .update({ plataforma: rating.plataforma, nota: rating.nota, max: rating.max, display: rating.display })
        .eq("id", rating.id);
      if (error) throw new Error(error.message);
    }

    // Rows omitted from the submitted list (removed client-side) get deleted here —
    // the client doesn't send an explicit delete marker, it just drops them from the array.
    const submittedIds = data.depoimentos.filter((d) => d.id).map((d) => d.id!);
    const { data: existingRows, error: existingError } = await supabase.from("depoimentos").select("id");
    if (existingError) throw new Error(existingError.message);
    const toDelete = (existingRows ?? []).map((r) => r.id).filter((id) => !submittedIds.includes(id));
    if (toDelete.length > 0) {
      const { error } = await supabase.from("depoimentos").delete().in("id", toDelete);
      if (error) throw new Error(error.message);
    }

    for (let i = 0; i < data.depoimentos.length; i++) {
      const d = data.depoimentos[i];
      const payload = { nome: d.nome, origem: d.origem, texto: d.texto, sort_order: i };
      if (d.id) {
        const { error } = await supabase.from("depoimentos").update(payload).eq("id", d.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("depoimentos").insert(payload);
        if (error) throw new Error(error.message);
      }
    }

    return { ok: true };
  });
