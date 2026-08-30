import { useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Loader2, Star, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabase";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  PROPERTY_IMAGES_BUCKET,
  propertyImageUrl,
  type PropertyImage,
} from "@/lib/property-images";
import {
  addPropertyImage,
  createPropertyImageUploadUrl,
  deletePropertyImage,
  reorderPropertyImages,
  setPropertyImageCover,
} from "@/lib/properties.server";

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

// `images` comes from the route loader — after every mutation the component
// calls router.invalidate() and lets the loader re-supply the list, so there is
// no second copy of this state to keep in sync.
export function PropertyImagesManager({
  propertyId,
  images,
}: {
  propertyId: string;
  images: PropertyImage[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PropertyImage | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  async function uploadOne(file: File) {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
      throw new Error(`"${file.name}": formato não aceito (use JPG, PNG ou WebP).`);
    }
    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error(`"${file.name}": passa de 5 MB.`);
    }

    // Signed URL is minted server-side (admin-only); the bytes go straight
    // from the browser to Storage, never through the SSR runtime.
    const { path, token } = await createPropertyImageUploadUrl({
      data: { propertyId, contentType: file.type },
    });

    const { error } = await supabase.storage
      .from(PROPERTY_IMAGES_BUCKET)
      .uploadToSignedUrl(path, token, file);
    if (error) throw new Error(`"${file.name}": ${error.message}`);

    await addPropertyImage({ data: { propertyId, storagePath: path } });
  }

  async function handleFiles(files: FileList) {
    setBusy(true);
    let ok = 0;
    for (const file of Array.from(files)) {
      try {
        await uploadOne(file);
        ok += 1;
      } catch (error) {
        toast.error(errorMessage(error, "Erro no upload."));
      }
    }
    if (ok > 0) toast.success(ok === 1 ? "Foto enviada." : `${ok} fotos enviadas.`);
    await router.invalidate();
    setBusy(false);
    if (fileInput.current) fileInput.current.value = "";
  }

  async function run(action: () => Promise<unknown>, fallback: string) {
    setBusy(true);
    try {
      await action();
      await router.invalidate();
    } catch (error) {
      toast.error(errorMessage(error, fallback));
    } finally {
      setBusy(false);
    }
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;

    const reordered = [...images];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    void run(
      () => reorderPropertyImages({ data: { propertyId, orderedIds: reordered.map((i) => i.id) } }),
      "Erro ao reordenar.",
    );
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Fotos do imóvel</h2>
        <p className="text-xs text-muted-foreground mt-1">
          JPG, PNG ou WebP, até 5 MB cada. A foto marcada como capa é a primeira que aparece no
          catálogo. Imóvel sem nenhuma foto usa as imagens genéricas provisórias.
        </p>
      </div>

      <input
        ref={fileInput}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) void handleFiles(e.target.files);
        }}
      />

      <Button
        type="button"
        variant="outline"
        disabled={busy}
        onClick={() => fileInput.current?.click()}
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {busy ? "Processando…" : "Enviar fotos"}
      </Button>

      {images.length === 0 ? (
        <p className="text-sm text-muted-foreground border border-dashed border-border rounded-md p-4">
          Nenhuma foto ainda. Enquanto isso, o catálogo mostra as imagens genéricas provisórias.
        </p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((image, index) => (
            <li key={image.id} className="border border-border rounded-md overflow-hidden">
              <img
                src={propertyImageUrl(supabaseUrl, image.storage_path)}
                alt={`Foto ${index + 1} do imóvel`}
                className="w-full aspect-[4/3] object-cover bg-muted"
                loading="lazy"
              />
              <div className="flex items-center justify-between gap-1 p-1.5">
                <div className="flex items-center gap-0.5">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    disabled={busy || index === 0}
                    aria-label="Mover para trás"
                    onClick={() => move(index, -1)}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    disabled={busy || index === images.length - 1}
                    aria-label="Mover para frente"
                    onClick={() => move(index, 1)}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <div className="flex items-center gap-0.5">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className={`h-7 w-7 ${image.is_cover ? "text-gold" : ""}`}
                    disabled={busy || image.is_cover}
                    aria-label={image.is_cover ? "Esta é a capa" : "Definir como capa"}
                    title={image.is_cover ? "Capa atual" : "Definir como capa"}
                    onClick={() =>
                      void run(
                        () => setPropertyImageCover({ data: { propertyId, imageId: image.id } }),
                        "Erro ao definir a capa.",
                      )
                    }
                  >
                    <Star className={`w-3.5 h-3.5 ${image.is_cover ? "fill-current" : ""}`} />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive"
                    disabled={busy}
                    aria-label="Remover foto"
                    onClick={() => setPendingDelete(image)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover esta foto?</AlertDialogTitle>
            <AlertDialogDescription>
              A imagem é apagada do site e do armazenamento. Não dá para desfazer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const target = pendingDelete;
                setPendingDelete(null);
                if (target) {
                  void run(
                    () => deletePropertyImage({ data: target.id }),
                    "Erro ao remover a foto.",
                  );
                }
              }}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
