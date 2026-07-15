import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createSupabaseServerClient } from "./supabase.server";
import { requireAdminMiddleware } from "./admin-auth.server";

export type AdminProperty = {
  id: string;
  slug: string;
  status: "draft" | "active" | "inactive";
  name: string;
  short_desc: string | null;
  description: string | null;
  neighborhood: string | null;
  city: string;
  state: string;
  bedrooms: number | null;
  bathrooms: number | null;
  max_guests: number | null;
  amenities: string[] | null;
  visible_fields: Record<string, boolean>;
};

const propertyInputSchema = z.object({
  slug: z.string().min(1),
  status: z.enum(["draft", "active", "inactive"]),
  name: z.string().min(1),
  short_desc: z.string(),
  description: z.string(),
  neighborhood: z.string(),
  city: z.string().min(1),
  state: z.string().min(1),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().int().nonnegative(),
  max_guests: z.number().int().nonnegative(),
  amenities: z.array(z.string()),
  visible_fields: z.record(z.string(), z.boolean()),
});

export const listAdminProperties = createServerFn({ method: "GET" })
  .middleware([requireAdminMiddleware])
  .handler(async () => {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("properties")
    .select(
      "id, slug, status, name, short_desc, description, neighborhood, city, state, bedrooms, bathrooms, max_guests, amenities, visible_fields",
    )
    .order("created_at", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data as AdminProperty[];
});

export const getAdminProperty = createServerFn({ method: "GET" })
  .middleware([requireAdminMiddleware])
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("properties")
      .select(
        "id, slug, status, name, short_desc, description, neighborhood, city, state, bedrooms, bathrooms, max_guests, amenities, visible_fields",
      )
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data as AdminProperty;
  });

export const createAdminProperty = createServerFn({ method: "POST" })
  .middleware([requireAdminMiddleware])
  .validator((data: unknown) => propertyInputSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();
    const { data: created, error } = await supabase
      .from("properties")
      .insert(data)
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    return created as { id: string };
  });

export const updateAdminProperty = createServerFn({ method: "POST" })
  .middleware([requireAdminMiddleware])
  .validator((data: unknown) => z.object({ id: z.string(), fields: propertyInputSchema }).parse(data))
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("properties").update(data.fields).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteAdminProperty = createServerFn({ method: "POST" })
  .middleware([requireAdminMiddleware])
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
