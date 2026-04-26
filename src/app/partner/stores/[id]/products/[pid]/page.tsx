import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/partner/PartnerShell";
import { requireOwnedStore, requireOwner } from "@/lib/admin";
import { db } from "@/lib/db";
import { uploadImage } from "@/lib/storage";
import {
  type SaveActionState,
  withSaveResult,
} from "@/components/admin/SaveToast";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

const MAX_IMAGES = 5;

async function updateProduct(
  storeId: string,
  productId: string,
  _prev: SaveActionState,
  formData: FormData,
): Promise<SaveActionState> {
  "use server";
  return withSaveResult(async () => {
    await requireOwnedStore(storeId);
    const data = await parseForm(storeId, formData);
    await db.product.update({ where: { id: productId }, data });
    revalidatePath(`/partner/stores/${storeId}/products`);
    revalidatePath(`/partner/stores/${storeId}/products/${productId}`);
    revalidatePath(`/app/stores/${storeId}`);
    revalidatePath(`/app/stores/${storeId}/products/${productId}`);
  });
}

async function parseForm(storeId: string, fd: FormData) {
  const cautionsRaw = String(fd.get("cautions") ?? "").trim();

  // 다중 이미지
  const kinds = fd.getAll("productImageKind").map((v) => String(v));
  const urls = fd.getAll("productImageUrl").map((v) => String(v));
  const files = fd
    .getAll("productImageFile")
    .filter((v): v is File => v instanceof File);

  const images: string[] = [];
  let urlIdx = 0;
  let fileIdx = 0;
  for (const kind of kinds) {
    if (images.length >= MAX_IMAGES) break;
    if (kind === "url") {
      const u = urls[urlIdx++];
      if (u && u.trim()) images.push(u.trim());
    } else if (kind === "file") {
      const f = files[fileIdx++];
      if (f && f.size > 0) {
        const r = await uploadImage(f, { prefix: `stores/${storeId}/products` });
        if (r.ok) images.push(r.url);
      }
    }
  }

  return {
    type: String(fd.get("type") ?? "HAND") as
      | "SELF"
      | "HAND"
      | "PICKUP"
      | "VISIT",
    title: String(fd.get("title") ?? "").trim(),
    subtitle: String(fd.get("subtitle") ?? "").trim() || null,
    description: String(fd.get("description") ?? "").trim() || null,
    durationMin: Number(fd.get("durationMin") ?? 60),
    price: Number(fd.get("price") ?? 0),
    images,
    cautions: cautionsRaw
      ? cautionsRaw.split("\n").map((x) => x.trim()).filter(Boolean)
      : [],
  };
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string; pid: string };
}) {
  const user = await requireOwner();
  const store = await requireOwnedStore(params.id);
  const product = await db.product.findFirst({
    where: { id: params.pid, storeId: store.id },
  });
  if (!product) return notFound();

  const images = Array.isArray(product.images)
    ? (product.images as unknown[]).filter(
        (u): u is string => typeof u === "string",
      )
    : [];

  return (
    <AdminShell
      userName={user.name || user.email}
      storeName={store.name}
      storeId={store.id}
    >
      <h1 className="ww-disp text-[24px] tracking-[-0.02em] mb-6">
        {product.title}
      </h1>
      <ProductForm
        action={updateProduct.bind(null, store.id, product.id)}
        defaults={{
          title: product.title,
          subtitle: product.subtitle ?? "",
          description: product.description ?? "",
          type: product.type,
          price: product.price,
          durationMin: product.durationMin,
          images,
          cautions: product.cautions.join("\n"),
        }}
      />
    </AdminShell>
  );
}
