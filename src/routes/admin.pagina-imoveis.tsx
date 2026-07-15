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
import { getAdminSiteConfig, saveSiteConfig } from "@/lib/site-content.server";
import { RESULTADO_ICON_OPTIONS, type SiteSectionKey } from "@/lib/site-content";

export const Route = createFileRoute("/admin/pagina-imoveis")({
  component: AdminPaginaImoveis,
  loader: () => getAdminSiteConfig(),
});

type Depoimento = { id?: string; nome: string; origem: string; texto: string };

const SECTION_LABEL: Record<SiteSectionKey, string> = {
  catalogo: "Catálogo de imóveis",
  resultados: "Resultados",
  notas_apps: "Notas nos aplicativos",
  depoimentos: "Depoimentos",
};

function SectionHeader({
  sectionKey,
  visible,
  onToggle,
}: {
  sectionKey: SiteSectionKey;
  visible: boolean;
  onToggle: (visible: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
      <h2 className="text-lg font-semibold text-foreground">{SECTION_LABEL[sectionKey]}</h2>
      <div className="flex items-center gap-2">
        <Label htmlFor={`visible-${sectionKey}`} className="text-xs text-muted-foreground font-normal">
          Visível em /imoveis
        </Label>
        <Switch id={`visible-${sectionKey}`} checked={visible} onCheckedChange={onToggle} />
      </div>
    </div>
  );
}

function AdminPaginaImoveis() {
  const initial = Route.useLoaderData();
  const [sections, setSections] = useState(initial.sections);
  const [resultados, setResultados] = useState(initial.resultados);
  const [appRatings, setAppRatings] = useState(initial.appRatings);
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>(initial.depoimentos);
  const [submitting, setSubmitting] = useState(false);

  function toggleSection(key: SiteSectionKey, visible: boolean) {
    setSections((s) => ({ ...s, [key]: visible }));
  }

  function updateResultado(id: string, patch: Partial<(typeof resultados)[number]>) {
    setResultados((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function updateRating(id: string, patch: Partial<(typeof appRatings)[number]>) {
    setAppRatings((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function updateDepoimento(index: number, patch: Partial<Depoimento>) {
    setDepoimentos((rows) => rows.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  }

  function addDepoimento() {
    setDepoimentos((rows) => [...rows, { nome: "", origem: "", texto: "" }]);
  }

  function removeDepoimento(index: number) {
    setDepoimentos((rows) => rows.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSubmitting(true);
    try {
      await saveSiteConfig({
        data: {
          sections,
          resultados,
          appRatings,
          depoimentos,
        },
      });
      toast.success("Página /imoveis atualizada.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-foreground">Página /imoveis</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Controle quais seções aparecem no catálogo público e edite o conteúdo delas.
      </p>

      <div className="mt-8 space-y-10">
        {/* Catálogo */}
        <section>
          <SectionHeader
            sectionKey="catalogo"
            visible={sections.catalogo}
            onToggle={(v) => toggleSection("catalogo", v)}
          />
          <p className="text-sm text-muted-foreground">
            Grid com os imóveis ativos. Desligar esconde a lista de imóveis inteira em /imoveis
            (as outras seções continuam controladas independentemente).
          </p>
        </section>

        {/* Resultados */}
        <section>
          <SectionHeader
            sectionKey="resultados"
            visible={sections.resultados}
            onToggle={(v) => toggleSection("resultados", v)}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            {resultados.map((r) => (
              <div key={r.id} className="border border-border rounded-md p-4 space-y-3">
                <div className="space-y-1.5">
                  <Label>Ícone</Label>
                  <Select value={r.icon_key} onValueChange={(v) => updateResultado(r.id, { icon_key: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RESULTADO_ICON_OPTIONS.map((opt) => (
                        <SelectItem key={opt.key} value={opt.key}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Valor</Label>
                  <Input value={r.valor} onChange={(e) => updateResultado(r.id, { valor: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Legenda</Label>
                  <Input value={r.label} onChange={(e) => updateResultado(r.id, { label: e.target.value })} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Notas nos aplicativos */}
        <section>
          <SectionHeader
            sectionKey="notas_apps"
            visible={sections.notas_apps}
            onToggle={(v) => toggleSection("notas_apps", v)}
          />
          <div className="space-y-4">
            {appRatings.map((r) => (
              <div key={r.id} className="border border-border rounded-md p-4 grid sm:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <Label>Plataforma</Label>
                  <Input value={r.plataforma} onChange={(e) => updateRating(r.id, { plataforma: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Nota</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={r.nota}
                    onChange={(e) => updateRating(r.id, { nota: Number(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Máximo</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={r.max}
                    onChange={(e) => updateRating(r.id, { max: Number(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Texto exibido</Label>
                  <Input value={r.display} onChange={(e) => updateRating(r.id, { display: e.target.value })} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Depoimentos */}
        <section>
          <SectionHeader
            sectionKey="depoimentos"
            visible={sections.depoimentos}
            onToggle={(v) => toggleSection("depoimentos", v)}
          />
          <div className="space-y-4">
            {depoimentos.map((d, i) => (
              <div key={d.id ?? `new-${i}`} className="border border-border rounded-md p-4 space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Nome</Label>
                    <Input value={d.nome} onChange={(e) => updateDepoimento(i, { nome: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Origem (cidade, UF)</Label>
                    <Input value={d.origem} onChange={(e) => updateDepoimento(i, { origem: e.target.value })} />
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
                <Button type="button" variant="outline" size="sm" onClick={() => removeDepoimento(i)}>
                  <Trash2 className="w-3.5 h-3.5" />
                  Remover
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addDepoimento}>
              <Plus className="w-4 h-4" />
              Adicionar depoimento
            </Button>
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
