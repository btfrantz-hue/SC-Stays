export type ControllableFieldKey =
  | "short_desc"
  | "description"
  | "neighborhood"
  | "bedrooms"
  | "bathrooms"
  | "max_guests"
  | "amenities";

export type ControllableFieldConfig = {
  key: ControllableFieldKey;
  label: string;
  input: "text" | "textarea" | "number" | "list";
};

// Only fields actually rendered on /imoveis and /imoveis/$slug are controllable —
// toggling a field with no front-end usage would have no visible effect.
export const CONTROLLABLE_FIELDS: ControllableFieldConfig[] = [
  { key: "short_desc", label: "Descrição curta (card do catálogo)", input: "text" },
  { key: "neighborhood", label: "Bairro", input: "text" },
  { key: "bedrooms", label: "Quartos", input: "number" },
  { key: "bathrooms", label: "Banheiros", input: "number" },
  { key: "max_guests", label: "Hóspedes", input: "number" },
  { key: "description", label: "Descrição completa (página do imóvel)", input: "textarea" },
  { key: "amenities", label: "Comodidades (uma por linha)", input: "list" },
];

export function isFieldVisible(
  visibleFields: Record<string, boolean> | null | undefined,
  key: ControllableFieldKey,
): boolean {
  return visibleFields?.[key] !== false;
}
