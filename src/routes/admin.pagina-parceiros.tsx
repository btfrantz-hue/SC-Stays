import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAdminParceirosContent, saveParceirosContent } from "@/lib/parceiros-content.server";
import {
  PARCEIROS_RESULTADO_ICON_OPTIONS,
  PARCEIROS_SECTION_KEYS,
  PARCEIROS_SECTION_LABELS,
  type ParceirosSectionKey,
} from "@/lib/parceiros-content";

export const Route = createFileRoute("/admin/pagina-parceiros")({
  component: AdminPaginaParceiros,
  loader: () => getAdminParceirosContent(),
});

type Depoimento = { id?: string; nome: string; cidade: string; texto: string };

// Sections whose content is editable get their own block below, so the plain
// on/off list skips them to avoid showing the same switch twice.
const EDITABLE_CONTENT_KEYS: ParceirosSectionKey[] = ["resultados", "depoimentos"];

function AdminPaginaParceiros() {
  const initial = Route.useLoaderData();
  const [sections, setSections] = useState(initial.sections);
  const [resultados, setResultados] = useState(initial.resultados);
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>(initial.depoimentos);
  const [submitting, setSubmitting] = useState(false);

  function toggleSection(key: ParceirosSectionKey, visible: boolean) {
    setSections((s) => ({ ...s, [key]: visible }));
  }

  function updateResultado(id: string, patch: Partial<(typeof resultados)[number]>) {
    setResultados((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function updateDepoimento(index: number, patch: Partial<Depoimento>) {
    setDepoimentos((rows) => rows.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  }

  async function handleSave() {
    setSubmitting(true);
    try {
      await saveParceirosContent({ data: { sections, resultados, depoimentos } });
      toast.success("Página /parceiros atualizada.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-foreground">Página /parceiros</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Controle quais blocos aparecem na landing de proprietários e edite o conteúdo de Resultados
        e Depoimentos. O hero (topo, com a chamada principal) é sempre visível e não pode ser
        ocultado.
      </p>

      <div className="mt-8 space-y-10">
        {/* Resultados — 4 cards fixos */}
        <section>
          <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
            <h2 className="text-lg font-semibold text-foreground">Resultados</h2>
            <div className="flex items-center gap-2">
              <Label
                htmlFor="visible-resultados"
                className="text-xs text-muted-foreground font-normal"
              >
                Visível em /parceiros
              </Label>
              <Switch
                id="visible-resultados"
                checked={sections.resultados}
                onCheckedChange={(v) => toggleSection("resultados", v)}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Deixe o valor em branco para mostrar só o ícone e a legenda. Preenchendo (ex.:{" "}
            <span className="font-medium">92%</span>), o número aparece em destaque acima da
            legenda.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {resultados.map((r) => (
              <div key={r.id} className="border border-border rounded-md p-4 space-y-3">
                <div className="space-y-1.5">
                  <Label>Ícone</Label>
                  <Select
                    value={r.icon_key}
                    onValueChange={(v) => updateResultado(r.id, { icon_key: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PARCEIROS_RESULTADO_ICON_OPTIONS.map((opt) => (
                        <SelectItem key={opt.key} value={opt.key}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Valor (opcional)</Label>
                  <Input
                    value={r.valor}
                    placeholder="ex.: 92%"
                    onChange={(e) => updateResultado(r.id, { valor: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Legenda</Label>
                  <Input
                    value={r.label}
                    onChange={(e) => updateResultado(r.id, { label: e.target.value })}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Depoimentos de proprietários — lista dinâmica */}
        <section>
          <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
            <h2 className="text-lg font-semibold text-foreground">Depoimentos de proprietários</h2>
            <div className="flex items-center gap-2">
              <Label
                htmlFor="visible-depoimentos"
                className="text-xs text-muted-foreground font-normal"
              >
                Visível em /parceiros
              </Label>
              <Switch
                id="visible-depoimentos"
                checked={sections.depoimentos}
                onCheckedChange={(v) => toggleSection("depoimentos", v)}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Sem nenhum depoimento cadastrado a seção não aparece no site, mesmo ligada.
          </p>
          <div className="space-y-4">
            {depoimentos.map((d, i) => (
              <div
                key={d.id ?? `new-${i}`}
                className="border border-border rounded-md p-4 space-y-3"
              >
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Nome</Label>
                    <Input
                      value={d.nome}
                      onChange={(e) => updateDepoimento(i, { nome: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Cidade</Label>
                    <Input
                      value={d.cidade}
                      onChange={(e) => updateDepoimento(i, { cidade: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Depoimento</Label>
                  <Textarea
                    rows={3}
                    value={d.texto}
                    onChange={(e) => updateDepoimento(i, { texto: e.target.value })}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDepoimentos((rows) => rows.filter((_, idx) => idx !== i))}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remover
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setDepoimentos((rows) => [...rows, { nome: "", cidade: "", texto: "" }])
              }
            >
              <Plus className="w-4 h-4" />
              Adicionar depoimento
            </Button>
          </div>
        </section>

        {/* Demais blocos — só liga/desliga, texto continua no componente */}
        <section>
          <div className="border-b border-border pb-3 mb-5">
            <h2 className="text-lg font-semibold text-foreground">Demais blocos</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Só visibilidade — o texto destes blocos ainda vive no código.
            </p>
          </div>

          <div className="border border-border rounded-md divide-y divide-border">
            <div className="flex items-center justify-between p-4 bg-muted/40">
              <div>
                <div className="text-sm font-medium text-foreground">Hero</div>
                <div className="text-xs text-muted-foreground">
                  Chamada principal no topo da página
                </div>
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Sempre visível
              </span>
            </div>

            {PARCEIROS_SECTION_KEYS.filter((key) => !EDITABLE_CONTENT_KEYS.includes(key)).map(
              (key) => (
                <div key={key} className="flex items-center justify-between p-4">
                  <Label
                    htmlFor={`section-${key}`}
                    className="text-sm font-normal text-foreground cursor-pointer"
                  >
                    {PARCEIROS_SECTION_LABELS[key]}
                  </Label>
                  <Switch
                    id={`section-${key}`}
                    checked={sections[key]}
                    onCheckedChange={(checked) => toggleSection(key, checked)}
                  />
                </div>
              ),
            )}
          </div>
        </section>
      </div>

      <div className="mt-10 sticky bottom-6">
        <Button onClick={handleSave} disabled={submitting} size="lg">
          {submitting ? "Salvando…" : "Salvar alterações"}
        </Button>
      </div>
    </div>
  );
}
