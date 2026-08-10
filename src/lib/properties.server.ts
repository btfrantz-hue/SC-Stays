import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createSupabaseServerClient } from "./supabase.server";
import { requireAdminMiddleware } from "./admin-auth.server";
import {
  ACCEPTED_IMAGE_TYPES,
  PROPERTY_IMAGES_BUCKET,
  imageExtension,
  sortPropertyImages,
  type PropertyImage,
} from "./property-images";

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
  .validator((data: unknown) =>
    z.object({ id: z.string(), fields: propertyInputSchema }).parse(data),
  )
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

    // Storage has no cascade — the property_images rows go away with the
    // property (on delete cascade), but the objects would be orphaned forever.
    const { data: images } = await supabase
      .from("property_images")
      .select("storage_path")
      .eq("property_id", id);

    const paths = (images ?? []).map((i) => i.storage_path);
    if (paths.length > 0) {
      await supabase.storage.from(PROPERTY_IMAGES_BUCKET).remove(paths);
    }

    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------------------------------------------------------------------
 * Property images (SC-008)
 *
 * Bytes never travel through a server function: the admin asks for a signed
 * upload URL, the browser PUTs the file straight to Supabase Storage, then
 * registers the resulting path. That keeps the write path authenticated
 * (every function below carries requireAdminMiddleware) without pushing 5 MB
 * payloads through the SSR runtime.
 * ------------------------------------------------------------------------ */

export const listAdminPropertyImages = createServerFn({ method: "GET" })
  .middleware([requireAdminMiddleware])
  .validator((propertyId: string) => propertyId)
  .handler(async ({ data: propertyId }) => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("property_images")
      .select("id, storage_path, is_cover, sort_order")
      .eq("property_id", propertyId);

    if (error) throw new Error(error.message);
    return sortPropertyImages((data ?? []) as PropertyImage[]);
  });

export const createPropertyImageUploadUrl = createServerFn({ method: "POST" })
  .middleware([requireAdminMiddleware])
  .validator((data: unknown) =>
    z
      .object({
        propertyId: z.string().min(1),
        contentType: z.enum(ACCEPTED_IMAGE_TYPES),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();

    // Server-generated name: the original filename is never trusted into a
    // storage path, and a uuid avoids collisions between simultaneous uploads.
    const path = `${data.propertyId}/${crypto.randomUUID()}.${imageExtension(data.contentType)}`;

    const { data: signed, error } = await supabase.storage
      .from(PROPERTY_IMAGES_BUCKET)
      .createSignedUploadUrl(path);

    if (error) throw new Error(error.message);
    return { path: signed.path, token: signed.token };
  });

export const addPropertyImage = createServerFn({ method: "POST" })
  .middleware([requireAdminMiddleware])
  .validator((data: unknown) =>
    z.object({ propertyId: z.string().min(1), storagePath: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();

    const { data: existing, error: listError } = await supabase
      .from("property_images")
      .select("id, sort_order")
      .eq("property_id", data.propertyId);

    if (listError) throw new Error(listError.message);

    const rows = existing ?? [];
    const nextOrder = rows.reduce((max, r) => Math.max(max, r.sort_order ?? 0), -1) + 1;

    const { error } = await supabase.from("property_images").insert({
      property_id: data.propertyId,
      storage_path: data.storagePath,
      // First photo of a property becomes the cover, so a property is never
      // left without one.
      is_cover: rows.length === 0,
      sort_order: nextOrder,
    });

    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deletePropertyImage = createServerFn({ method: "POST" })
  .middleware([requireAdminMiddleware])
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const supabase = createSupabaseServerClient();

    const { data: image, error: findError } = await supabase
      .from("property_images")
      .select("id, property_id, storage_path, is_cover")
      .eq("id", id)
      .single();

    if (findError) throw new Error(findError.message);

    const { error } = await supabase.from("property_images").delete().eq("id", id);
    if (error) throw new Error(error.message);

    await supabase.storage.from(PROPERTY_IMAGES_BUCKET).remove([image.storage_path]);

    // Removing the cover would leave the property with none — promote whatever
    // is now first in the admin's order.
    if (image.is_cover) {
      const { data: rest } = await supabase
        .from("property_images")
        .select("id, sort_order")
        .eq("property_id", image.property_id)
        .order("sort_order", { ascending: true })
        .limit(1);

      if (rest && rest.length > 0) {
        await supabase.from("property_images").update({ is_cover: true }).eq("id", rest[0].id);
      }
    }

    return { ok: true };
  });

export const setPropertyImageCover = createServerFn({ method: "POST" })
  .middleware([requireAdminMiddleware])
  .validator((data: unknown) =>
    z.object({ propertyId: z.string().min(1), imageId: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();

    const { error: clearError } = await supabase
      .from("property_images")
      .update({ is_cover: false })
      .eq("property_id", data.propertyId);
    if (clearError) throw new Error(clearError.message);

    const { error } = await supabase
      .from("property_images")
      .update({ is_cover: true })
      .eq("id", data.imageId);
    if (error) throw new Error(error.message);

    return { ok: true };
  });

export const reorderPropertyImages = createServerFn({ method: "POST" })
  .middleware([requireAdminMiddleware])
  .validator((data: unknown) =>
    z.object({ propertyId: z.string().min(1), orderedIds: z.array(z.string().min(1)) }).parse(data),
  )
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();

    // Scoped by property_id as well as id so a crafted payload cannot reorder
    // (or touch) images belonging to a different property.
    for (const [index, id] of data.orderedIds.entries()) {
      const { error } = await supabase
        .from("property_images")
        .update({ sort_order: index })
        .eq("id", id)
        .eq("property_id", data.propertyId);
      if (error) throw new Error(error.message);
    }

    return { ok: true };
  });
