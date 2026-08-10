// Shared between the public catalog (anon client) and the admin panel
// (service role) — keep it free of server-only imports.
export const PROPERTY_IMAGES_BUCKET = "property-images";

// Mirrors the bucket's own constraints, set when it was created (SC-008).
// Enforced again here so the admin gets an immediate error instead of a
// rejected upload halfway through.
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export type PropertyImage = {
  id: string;
  storage_path: string;
  is_cover: boolean;
  sort_order: number;
};

// The bucket is public, so the object URL is stable and needs no signing.
export function propertyImageUrl(supabaseUrl: string, storagePath: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${PROPERTY_IMAGES_BUCKET}/${storagePath}`;
}

// Cover first, then the admin-defined order — the first entry is what the
// catalog card shows before the visitor interacts with the slider.
export function sortPropertyImages<T extends { is_cover: boolean; sort_order: number }>(
  images: T[],
): T[] {
  return [...images].sort((a, b) => {
    if (a.is_cover !== b.is_cover) return a.is_cover ? -1 : 1;
    return a.sort_order - b.sort_order;
  });
}

export function imageExtension(contentType: string): string {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  return "jpg";
}
