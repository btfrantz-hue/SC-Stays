import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { PropertyForm, type PropertyFormValues } from "@/components/admin/property-form";
import { PropertyImagesManager } from "@/components/admin/property-images-manager";
import {
  getAdminProperty,
  listAdminPropertyImages,
  updateAdminProperty,
} from "@/lib/properties.server";

export const Route = createFileRoute("/admin/imoveis/$id")({
  component: EditarImovel,
  loader: async ({ params }) => {
    const [property, images] = await Promise.all([
      getAdminProperty({ data: params.id }),
      listAdminPropertyImages({ data: params.id }),
    ]);
    return { property, images };
  },
});

function EditarImovel() {
  const { property, images } = Route.useLoaderData();
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
      <Link
        to="/admin/imoveis"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="w-4 h-4" />
        Voltar
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-foreground">{property.name}</h1>

      {/* Photos sit outside the form on purpose: each action here saves on its
          own, while the fields below only persist on "Salvar imóvel". */}
      <div className="mt-6 max-w-2xl border-b border-border pb-8">
        <PropertyImagesManager propertyId={property.id} images={images} />
      </div>

      <div className="mt-8">
        <PropertyForm property={property} submitting={submitting} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
