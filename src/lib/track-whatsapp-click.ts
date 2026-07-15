import { logWhatsappClick } from "./leads.server";

export function trackWhatsappClick(input: { page: string; button: string; propertySlug?: string }) {
  logWhatsappClick({ data: input }).catch((error) => {
    console.error("Falha ao registrar clique de WhatsApp:", error);
  });
}
