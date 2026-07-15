import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createSupabaseServerClient } from "./supabase.server";
import { requireAdminMiddleware } from "./admin-auth.server";
import { PARCEIROS_SECTION_KEYS, type ParceirosSectionKey } from "./parceiros-content";

const DB_KEY_PREFIX = "parceiros_";

const sectionsSchema = z.object(
  Object.fromEntries(PARCEIROS_SECTION_KEYS.map((k) => [k, z.boolean()])) as Record<
    ParceirosSectionKey,
    z.ZodBoolean
  >,
);

function defaults(): Record<ParceirosSectionKey, boolean> {
  return Object.fromEntries(PARCEIROS_SECTION_KEYS.map((k) => [k, true])) as Record<ParceirosSectionKey, boolean>;
}

export const getAdminParceirosSections = createServerFn({ method: "GET" })
  .middleware([requireAdminMiddleware])
  .handler(async (): Promise<Record<ParceirosSectionKey, boolean>> => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("site_sections")
      .select("key, visible")
      .like("key", `${DB_KEY_PREFIX}%`);
    if (error) throw new Error(error.message);

    const result = defaults();
    for (const row of data ?? []) {
      const key = row.key.slice(DB_KEY_PREFIX.length) as ParceirosSectionKey;
      if (key in result) result[key] = row.visible;
    }
    return result;
  });

export const saveParceirosSections = createServerFn({ method: "POST" })
  .middleware([requireAdminMiddleware])
  .validator((data: unknown) => sectionsSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();
    for (const key of PARCEIROS_SECTION_KEYS) {
      const { error } = await supabase
        .from("site_sections")
        .update({ visible: data[key] })
        .eq("key", `${DB_KEY_PREFIX}${key}`);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });
