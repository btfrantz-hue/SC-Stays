import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CONTROLLABLE_FIELDS, isFieldVisible } from "@/lib/property-fields";
import type { AdminProperty } from "@/lib/properties.server";

export type PropertyFormValues = {
  slug: string;
  status: "draft" | "active" | "inactive";
  name: string;
  short_desc: string;
  description: string;
  neighborhood: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  amenities: string[];
  visible_fields: Record<string, boolean>;
};

function toFormValues(property?: AdminProperty): PropertyFormValues {
  return {
    slug: property?.slug ?? "",
    status: property?.status ?? "draft",
    name: property?.name ?? "",
    short_desc: property?.short_desc ?? "",
    description: property?.description ?? "",
    neighborhood: property?.neighborhood ?? "",
    city: property?.city ?? "Florianópolis",
    state: property?.state ?? "SC",
    bedrooms: property?.bedrooms ?? 0,
    bathrooms: property?.bathrooms ?? 0,
    max_guests: property?.max_guests ?? 0,
    amenities: property?.amenities ?? [],
    visible_fields: property?.visible_fields ?? {},
  };
}

export function PropertyForm({
  property,
  submitting,
  onSubmit,
}: {
  property?: AdminProperty;
  submitting: boolean;
  onSubmit: (values: PropertyFormValues) => void;
}) {
  const [values, setValues] = useState<PropertyFormValues>(() => toFormValues(property));

  function set<K extends keyof PropertyFormValues>(key: K, value: PropertyFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function toggleVisible(key: string, visible: boolean) {
    setValues((v) => ({ ...v, visible_fields: { ...v.visible_fields, [key]: visible } }));
  }

  function fieldValue(key: string): string {
    if (key === "amenities") return values.amenities.join("\n");
    const raw = (values as Record<string, unknown>)[key];
    return raw == null ? "" : String(raw);
  }

  function setFieldValue(key: string, raw: string) {
    if (key === "amenities") {
      set(
        "amenities",
        raw
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      );
      return;
    }
    if (key === "bedrooms" || key === "bathrooms" || key === "max_guests") {
      set(key, Number(raw) || 0);
      return;
    }
    set(key as "short_desc" | "description" | "neighborhood", raw);
  }

  return (
    <form
      className="space-y-8 max-w-2xl"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
    >
      {/* Core fields — always shown publicly, no visibility toggle */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Identificação</h2>

        <div className="space-y-1.5">
          <Label htmlFor="name">Nome do imóvel</Label>
          <Input id="name" value={values.name} onChange={(e) => set("name", e.target.value)} required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input id="slug" value={values.slug} onChange={(e) => set("slug", e.target.value)} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="city">Cidade</Label>
            <Input id="city" value={values.city} onChange={(e) => set("city", e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="state">Estado</Label>
            <Input id="state" value={values.state} onChange={(e) => set("state", e.target.value)} required />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select value={values.status} onValueChange={(v) => set("status", v as PropertyFormValues["status"])}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Rascunho (não aparece publicamente)</SelectItem>
              <SelectItem value="active">Ativo (visível em /imoveis)</SelectItem>
              <SelectItem value="inactive">Inativo (não aparece publicamente)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Controllable fields — text + visibility checkbox */}
      <div className="space-y-5">
        <h2 className="text-sm font-semibold text-foreground">Conteúdo exibido no site</h2>
        <p className="text-xs text-muted-foreground -mt-3">
          Desmarque a caixa para ocultar o campo no catálogo público, sem apagar o valor salvo.
        </p>

        {CONTROLLABLE_FIELDS.map((field) => {
          const visible = isFieldVisible(values.visible_fields, field.key);
          return (
            <div key={field.key} className="space-y-1.5 border border-border/60 rounded-md p-3">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor={field.key}>{field.label}</Label>
                <div className="flex items-center gap-2 shrink-0">
                  <Checkbox
                    id={`${field.key}-visible`}
                    checked={visible}
                    onCheckedChange={(checked) => toggleVisible(field.key, checked === true)}
                  />
                  <Label htmlFor={`${field.key}-visible`} className="text-xs font-normal text-muted-foreground">
                    Visível no site
                  </Label>
                </div>
              </div>

              {field.input === "textarea" || field.input === "list" ? (
                <Textarea
                  id={field.key}
                  value={fieldValue(field.key)}
                  onChange={(e) => setFieldValue(field.key, e.target.value)}
                  rows={field.input === "list" ? 5 : 4}
                />
              ) : (
                <Input
                  id={field.key}
                  type={field.input === "number" ? "number" : "text"}
                  value={fieldValue(field.key)}
                  onChange={(e) => setFieldValue(field.key, e.target.value)}
                />
              )}
            </div>
          );
        })}
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Salvando…" : "Salvar imóvel"}
      </Button>
    </form>
  );
}
