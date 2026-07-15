import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  getAdminParceirosSections,
  saveParceirosSections,
} from "@/lib/parceiros-content.server";
import { PARCEIROS_SECTION_KEYS, PARCEIROS_SECTION_LABELS } from "@/lib/parceiros-content";

export const Route = createFileRoute("/admin/pagina-parceiros")({
  component: AdminPaginaParceiros,
  loader: () => getAdminParceirosSections(),
});

function AdminPaginaParceiros() {
  const initial = Route.useLoaderData();
  const [sections, setSections] = useState(initial);
  const [submitting, setSubmitting] = useState(false);

  async function handleSave() {
    setSubmitting(true);
    try {
      await saveParceirosSections({ data: sections });
      toast.success("Página /parceiros atualizada.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-foreground">Página /parceiros</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Controle quais blocos aparecem na landing de proprietários. O hero (topo, com a chamada
        principal) é sempre visível e não pode ser ocultado.
      </p>

      <div className="mt-8 border border-border rounded-md divide-y divide-border">
        <div className="flex items-center justify-between p-4 bg-muted/40">
          <div>
            <div className="text-sm font-medium text-foreground">Hero</div>
            <div className="text-xs text-muted-foreground">Chamada principal no topo da página</div>
          </div>
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Sempre visível</span>
        </div>

        {PARCEIROS_SECTION_KEYS.map((key) => (
          <div key={key} className="flex items-center justify-between p-4">
            <Label htmlFor={`section-${key}`} className="text-sm font-normal text-foreground cursor-pointer">
              {PARCEIROS_SECTION_LABELS[key]}
            </Label>
            <Switch
              id={`section-${key}`}
              checked={sections[key]}
              onCheckedChange={(checked) => setSections((s) => ({ ...s, [key]: checked }))}
            />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Button onClick={handleSave} disabled={submitting} size="lg">
          {submitting ? "Salvando…" : "Salvar alterações"}
        </Button>
      </div>
    </div>
  );
}
