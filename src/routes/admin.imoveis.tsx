import { createFileRoute, Link, useMatchRoute, useRouter, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { listAdminProperties, deleteAdminProperty } from "@/lib/properties.server";

export const Route = createFileRoute("/admin/imoveis")({
  component: AdminImoveisRoot,
  loader: () => listAdminProperties(),
});

const STATUS_LABEL: Record<string, string> = {
  draft: "Rascunho",
  active: "Ativo",
  inactive: "Inativo",
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  draft: "secondary",
  inactive: "outline",
};

function AdminImoveisRoot() {
  const matchRoute = useMatchRoute();
  const isExact = matchRoute({ to: "/admin/imoveis" });
  return isExact ? <AdminImoveisList /> : <Outlet />;
}

function AdminImoveisList() {
  const properties = Route.useLoaderData();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteAdminProperty({ data: id });
      toast.success("Imóvel excluído.");
      await router.invalidate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao excluir imóvel.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Imóveis</h1>
        <Link
          to="/admin/imoveis/novo"
          className="inline-flex items-center px-5 py-2.5 text-xs tracking-[0.24em] uppercase bg-navy text-cream hover:bg-navy-deep transition"
        >
          + Novo imóvel
        </Link>
      </div>

      <div className="mt-6 border border-border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">{property.name}</TableCell>
                <TableCell className="text-muted-foreground">{property.slug}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[property.status]}>
                    {STATUS_LABEL[property.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      to="/admin/imoveis/$id"
                      params={{ id: property.id }}
                      className="text-sm text-gold hover:underline"
                    >
                      Editar
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          aria-label={`Excluir ${property.name}`}
                          disabled={deletingId === property.id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir "{property.name}"?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Essa ação não pode ser desfeita. O imóvel e suas fotos associadas serão
                            removidos permanentemente e ele deixará de aparecer em /imoveis.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(property.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {properties.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  Nenhum imóvel cadastrado ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
