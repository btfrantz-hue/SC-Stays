import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createSupabaseServerClient } from "./supabase.server";
import { requireAdminMiddleware } from "./admin-auth.server";

export type ProposalLead = {
  id: string;
  created_at: string;
  nome: string;
  email: string;
  telefone: string | null;
  bairro: string;
  situacao: string;
  status: "novo" | "contatado" | "convertido" | "perdido";
};

export type WhatsappClick = {
  id: string;
  created_at: string;
  page: string;
  button: string;
  property_slug: string | null;
};

const proposalLeadInput = z.object({
  nome: z.string().min(1),
  email: z.string().email(),
  telefone: z.string().optional().default(""),
  bairro: z.string().min(1),
  situacao: z.string().min(1),
});

const whatsappClickInput = z.object({
  page: z.string().min(1),
  button: z.string().min(1),
  propertySlug: z.string().optional(),
});

// Public — called anonymously from the proposal form and WhatsApp CTAs.
export const submitProposalLead = createServerFn({ method: "POST" })
  .validator((data: unknown) => proposalLeadInput.parse(data))
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("proposal_leads").insert({
      nome: data.nome,
      email: data.email,
      telefone: data.telefone || null,
      bairro: data.bairro,
      situacao: data.situacao,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const logWhatsappClick = createServerFn({ method: "POST" })
  .validator((data: unknown) => whatsappClickInput.parse(data))
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("whatsapp_clicks").insert({
      page: data.page,
      button: data.button,
      property_slug: data.propertySlug || null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Admin-only reads/writes below.
export const listProposalLeads = createServerFn({ method: "GET" })
  .middleware([requireAdminMiddleware])
  .handler(async () => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("proposal_leads")
      .select("id, created_at, nome, email, telefone, bairro, situacao, status")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as ProposalLead[];
  });

export const updateProposalLeadStatus = createServerFn({ method: "POST" })
  .middleware([requireAdminMiddleware])
  .validator((data: unknown) =>
    z.object({ id: z.string(), status: z.enum(["novo", "contatado", "convertido", "perdido"]) }).parse(data),
  )
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("proposal_leads").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listWhatsappClicks = createServerFn({ method: "GET" })
  .middleware([requireAdminMiddleware])
  .handler(async () => {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("whatsapp_clicks")
      .select("id, created_at, page, button, property_slug")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data as WhatsappClick[];
  });
