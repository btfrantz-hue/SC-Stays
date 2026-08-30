import { supabase } from "./supabase";
import { FALLBACK_IMAGES } from "./property-image-fallback";
import { propertyImageUrl, sortPropertyImages } from "./property-images";

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

type ImageRow = { storage_path: string; is_cover: boolean; sort_order: number };

// property_images is joined through the FK; RLS on that table already limits
// rows to images of active properties, so no extra filter is needed here.
const PUBLIC_COLUMNS =
  "slug, name, short_desc, description, neighborhood, city, state, bedrooms, bathrooms, max_guests, amenities, visible_fields, property_images(storage_path, is_cover, sort_order)";

// A property with no photos yet still has to render a card, so it keeps the
// local placeholders (SC-008). Once every property has real photos this
// fallback — and property-image-fallback.ts — can go.
function resolveImages(rows: ImageRow[] | null | undefined): string[] {
  if (!rows || rows.length === 0) return FALLBACK_IMAGES;
  return sortPropertyImages(rows).map((row) =>
    propertyImageUrl(import.meta.env.VITE_SUPABASE_URL, row.storage_path),
  );
}

function toPublicProperty(row: Record<string, unknown>): PublicProperty {
  const { property_images, ...rest } = row as { property_images?: ImageRow[] };
  return { ...(rest as Omit<PublicProperty, "images">), images: resolveImages(property_images) };
}

export async function listActiveProperties(): Promise<PublicProperty[]> {
  const { data, error } = await supabase
    .from("properties")
    .select(PUBLIC_COLUMNS)
    .eq("status", "active")
    .order("created_at", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map((p) => toPublicProperty(p as Record<string, unknown>));
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
  return toPublicProperty(data as Record<string, unknown>);
}
