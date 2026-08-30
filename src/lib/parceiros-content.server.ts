import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createSupabaseServerClient } from "./supabase.server";
import { requireAdminMiddleware } from "./admin-auth.server";
import {
  PARCEIROS_SECTION_KEYS,
  mapSectionRows,
  type ParceirosPageContent,
  type ParceirosSectionKey,
} from "./parceiros-content";

const DB_KEY_PREFIX = "parceiros_";

const sectionsSchema = z.object(
  Object.fromEntries(PARCEIROS_SECTION_KEYS.map((k) => [k, z.boolean()])) as Record<
    ParceirosSectionKey,
    z.ZodBoolean
  >,
);

const resultadoSchema = z.object({
  id: z.string(),
  icon_key: z.string().min(1),
  // Unlike the /imoveis cards, `valor` may be empty — see parceiros-content.ts.
  valor: z.string(),
  label: z.string().min(1),
});

const depoimentoSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1),
  cidade: z.string().min(1),
  texto: z.string().min(1),
});

const saveSchema = z.object({
  sections: sectionsSchema,
  resultados: z.array(resultadoSchema),
  depoimentos: z.array(depoimentoSchema),
});

export const getAdminParceirosContent = createServerFn({ method: "GET" })
  .middleware([requireAdminMiddleware])
  .handler(async (): Promise<ParceirosPageContent> => {
    const supabase = createSupabaseServerClient();
    const [sectionsRes, resultadosRes, depoimentosRes] = await Promise.all([
      supabase.from("site_sections").select("key, visible").like("key", `${DB_KEY_PREFIX}%`),
      supabase
        .from("parceiros_resultados")
        .select("id, icon_key, valor, label")
        .order("sort_order"),
      supabase.from("parceiros_depoimentos").select("id, nome, cidade, texto").order("sort_order"),
    ]);

    if (sectionsRes.error) throw new Error(sectionsRes.error.message);
    if (resultadosRes.error) throw new Error(resultadosRes.error.message);
    if (depoimentosRes.error) throw new Error(depoimentosRes.error.message);

    return {
      sections: mapSectionRows(sectionsRes.data),
      resultados: resultadosRes.data ?? [],
      depoimentos: depoimentosRes.data ?? [],
    };
  });

export const saveParceirosContent = createServerFn({ method: "POST" })
  .middleware([requireAdminMiddleware])
  .validator((data: unknown) => saveSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();

    for (const key of PARCEIROS_SECTION_KEYS) {
      const { error } = await supabase
        .from("site_sections")
        .update({ visible: data.sections[key] })
        .eq("key", `${DB_KEY_PREFIX}${key}`);
      if (error) throw new Error(error.message);
    }

    for (const card of data.resultados) {
      const { error } = await supabase
        .from("parceiros_resultados")
        .update({ icon_key: card.icon_key, valor: card.valor, label: card.label })
        .eq("id", card.id);
      if (error) throw new Error(error.message);
    }

    // Rows the admin removed are simply absent from the submitted array — there
    // is no delete flag. Same approach as saveSiteConfig; getting this wrong is
    // what made "Remover" silently no-op in SC-021.
    const submittedIds = data.depoimentos.filter((d) => d.id).map((d) => d.id!);
    const { data: existingRows, error: existingError } = await supabase
      .from("parceiros_depoimentos")
      .select("id");
    if (existingError) throw new Error(existingError.message);

    const toDelete = (existingRows ?? [])
      .map((r) => r.id)
      .filter((id) => !submittedIds.includes(id));
    if (toDelete.length > 0) {
      const { error } = await supabase.from("parceiros_depoimentos").delete().in("id", toDelete);
      if (error) throw new Error(error.message);
    }

    for (let i = 0; i < data.depoimentos.length; i++) {
      const d = data.depoimentos[i];
      const payload = { nome: d.nome, cidade: d.cidade, texto: d.texto, sort_order: i };
      if (d.id) {
        const { error } = await supabase
          .from("parceiros_depoimentos")
          .update(payload)
          .eq("id", d.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("parceiros_depoimentos").insert(payload);
        if (error) throw new Error(error.message);
      }
    }

    return { ok: true };
  });
