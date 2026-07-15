import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  listProposalLeads,
  listWhatsappClicks,
  updateProposalLeadStatus,
  type ProposalLead,
  type WhatsappClick,
} from "@/lib/leads.server";
import { toCsv, downloadCsv } from "@/lib/csv";

export const Route = createFileRoute("/admin/leads")({
  component: AdminLeads,
  loader: async () => {
    const [proposalLeads, whatsappClicks] = await Promise.all([
      listProposalLeads(),
      listWhatsappClicks(),
    ]);
    return { proposalLeads, whatsappClicks };
  },
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

const STATUS_LABEL: Record<ProposalLead["status"], string> = {
  novo: "Novo",
  contatado: "Contatado",
  convertido: "Convertido",
  perdido: "Perdido",
};

const PAGE_LABEL: Record<string, string> = {
  parceiros: "/parceiros",
  imoveis: "/imoveis",
  imoveis_slug: "/imoveis/:slug",
};

const BUTTON_LABEL: Record<string, string> = {
  floating: "Botão flutuante",
  cta_intermediario: "CTA intermediário",
  footer_contato: "Rodapé — contato",
  form_proposta_fallback: "Fallback do formulário",
  catalogo_geral: "Catálogo — geral",
  detalhe_imovel: "Detalhe do imóvel",
};

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function isWithinLast30Days(iso: string) {
  return Date.now() - new Date(iso).getTime() <= THIRTY_DAYS_MS;
}

function useIndicators(leads: ProposalLead[], clicks: WhatsappClick[]) {
  return useMemo(() => {
    const totalLeads = leads.length;
    const totalClicks = clicks.length;
    const leadsLast30 = leads.filter((l) => isWithinLast30Days(l.created_at)).length;
    const clicksLast30 = clicks.filter((c) => isWithinLast30Days(c.created_at)).length;
    const conversionRate = totalClicks > 0 ? (totalLeads / totalClicks) * 100 : null;

    const byButton = new Map<string, number>();
    for (const c of clicks) {
      const key = `${PAGE_LABEL[c.page] ?? c.page} — ${BUTTON_LABEL[c.button] ?? c.button}`;
      byButton.set(key, (byButton.get(key) ?? 0) + 1);
    }
    const clicksBreakdown = [...byButton.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

    return { totalLeads, totalClicks, leadsLast30, clicksLast30, conversionRate, clicksBreakdown };
  }, [leads, clicks]);
}

function KpiCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-normal uppercase tracking-wide text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold text-foreground">{value}</div>
        {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
      </CardContent>
    </Card>
  );
}

function exportLeadsCsv(leads: ProposalLead[]) {
  const csv = toCsv(leads, [
    { key: "created_at", label: "Data" },
    { key: "nome", label: "Nome" },
    { key: "email", label: "E-mail" },
    { key: "telefone", label: "Telefone" },
    { key: "bairro", label: "Bairro" },
    { key: "situacao", label: "Situação do imóvel" },
    { key: "status", label: "Status" },
  ]);
  downloadCsv(`propostas-${new Date().toISOString().slice(0, 10)}.csv`, csv);
}

function exportClicksCsv(clicks: WhatsappClick[]) {
  const csv = toCsv(clicks, [
    { key: "created_at", label: "Data" },
    { key: "page", label: "Página" },
    { key: "button", label: "Botão" },
    { key: "property_slug", label: "Imóvel" },
  ]);
  downloadCsv(`cliques-whatsapp-${new Date().toISOString().slice(0, 10)}.csv`, csv);
}

function AdminLeads() {
  const { proposalLeads, whatsappClicks } = Route.useLoaderData();
  const [leads, setLeads] = useState(proposalLeads);
  const indicators = useIndicators(leads, whatsappClicks);

  async function handleStatusChange(id: string, status: ProposalLead["status"]) {
    const previous = leads;
    setLeads((current) => current.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      await updateProposalLeadStatus({ data: { id, status } });
    } catch (error) {
      setLeads(previous);
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar status.");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Indicadores e leads</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Log de propostas e cliques em WhatsApp do site, com indicadores de performance da página.
        Cliques mostram os 500 mais recentes.
      </p>

      {/* ── Indicadores ──────────────────────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Propostas (total)" value={String(indicators.totalLeads)} hint={`${indicators.leadsLast30} nos últimos 30 dias`} />
        <KpiCard label="Cliques no WhatsApp" value={String(indicators.totalClicks)} hint={`${indicators.clicksLast30} nos últimos 30 dias`} />
        <KpiCard
          label="Taxa proposta / clique"
          value={indicators.conversionRate == null ? "—" : `${indicators.conversionRate.toFixed(1)}%`}
          hint="Aproximada — não rastreia sessão"
        />
        <KpiCard
          label="Aguardando contato"
          value={String(leads.filter((l) => l.status === "novo").length)}
          hint={`de ${indicators.totalLeads} propostas`}
        />
      </div>

      {indicators.clicksBreakdown.length > 0 && (
        <div className="mt-6 border border-border rounded-md p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3">Cliques de WhatsApp por origem</h2>
          <div className="space-y-2">
            {indicators.clicksBreakdown.map((row) => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium text-foreground">{row.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Log detalhado ────────────────────────────────────────────────── */}
      <Tabs defaultValue="propostas" className="mt-8">
        <TabsList>
          <TabsTrigger value="propostas">Propostas ({leads.length})</TabsTrigger>
          <TabsTrigger value="whatsapp">Cliques no WhatsApp ({whatsappClicks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="propostas">
          <div className="mt-4 flex justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => exportLeadsCsv(leads)}>
              <Download className="w-3.5 h-3.5" />
              Exportar CSV
            </Button>
          </div>
          <div className="mt-3 border border-border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Bairro</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(lead.created_at)}
                    </TableCell>
                    <TableCell className="font-medium">{lead.nome}</TableCell>
                    <TableCell>
                      <div>{lead.email}</div>
                      {lead.telefone && <div className="text-muted-foreground">{lead.telefone}</div>}
                    </TableCell>
                    <TableCell>{lead.bairro}</TableCell>
                    <TableCell className="max-w-[220px]">{lead.situacao}</TableCell>
                    <TableCell>
                      <Select
                        value={lead.status}
                        onValueChange={(value) => handleStatusChange(lead.id, value as ProposalLead["status"])}
                      >
                        <SelectTrigger className="h-8 w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(STATUS_LABEL) as ProposalLead["status"][]).map((status) => (
                            <SelectItem key={status} value={status}>
                              {STATUS_LABEL[status]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
                {leads.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Nenhuma proposta recebida ainda.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="whatsapp">
          <div className="mt-4 flex justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => exportClicksCsv(whatsappClicks)}>
              <Download className="w-3.5 h-3.5" />
              Exportar CSV
            </Button>
          </div>
          <div className="mt-3 border border-border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Página</TableHead>
                  <TableHead>Botão</TableHead>
                  <TableHead>Imóvel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {whatsappClicks.map((click) => (
                  <TableRow key={click.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(click.created_at)}
                    </TableCell>
                    <TableCell>{PAGE_LABEL[click.page] ?? click.page}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{BUTTON_LABEL[click.button] ?? click.button}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{click.property_slug ?? "—"}</TableCell>
                  </TableRow>
                ))}
                {whatsappClicks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      Nenhum clique registrado ainda.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
