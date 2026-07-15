import { supabase } from "./supabase";
import { FALLBACK_IMAGES } from "./property-image-fallback";

export type PublicProperty = {
  slug: string;
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
  images: string[];
};

const PUBLIC_COLUMNS =
  "slug, name, short_desc, description, neighborhood, city, state, bedrooms, bathrooms, max_guests, amenities, visible_fields";

export async function listActiveProperties(): Promise<PublicProperty[]> {
  const { data, error } = await supabase
    .from("properties")
    .select(PUBLIC_COLUMNS)
    .eq("status", "active")
    .order("created_at", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map((p) => ({ ...p, images: FALLBACK_IMAGES }));
}

export async function getActiveProperty(slug: string): Promise<PublicProperty | null> {
  const { data, error } = await supabase
    .from("properties")
    .select(PUBLIC_COLUMNS)
    .eq("status", "active")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return { ...data, images: FALLBACK_IMAGES };
}
