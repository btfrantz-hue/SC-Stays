import heroLiving from "@/assets/hero-living.jpg";
import bedroom from "@/assets/bedroom.jpg";
import coast from "@/assets/coast.jpg";

// TEMPORARY: imagens ainda não vêm do Supabase Storage (SC-008 pendente).
// Enquanto o bucket/upload não existir, todo imóvel usa este fallback local.
export const FALLBACK_IMAGES = [heroLiving, bedroom, coast];
