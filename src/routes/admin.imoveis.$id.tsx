import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { PropertyForm, type PropertyFormValues } from "@/components/admin/property-form";
import { getAdminProperty, updateAdminProperty } from "@/lib/properties.server";

export const Route = createFileRoute("/admin/imoveis/$id")({
  component: EditarImovel,
  loader: ({ params }) => getAdminProperty({ data: params.id }),
});

function EditarImovel() {
  const property = Route.useLoaderData();
  const navigate = useNavigate();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(values: PropertyFormValues) {
    setSubmitting(true);
    try {
      await updateAdminProperty({ data: { id: property.id, fields: values } });
      toast.success("Imóvel atualizado.");
      await router.invalidate();
      navigate({ to: "/admin/imoveis" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar imóvel.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Link to="/admin/imoveis" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="w-4 h-4" />
        Voltar
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-foreground">{property.name}</h1>
      <div className="mt-6">
        <PropertyForm property={property} submitting={submitting} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
