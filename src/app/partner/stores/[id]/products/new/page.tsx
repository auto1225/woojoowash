import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/partner/PartnerShell";
import { requireOwnedStore, requireOwner } from "@/lib/admin";
import { db } from "@/lib/db";
import { uploadImage } from "@/lib/storage";
import {
  type SaveActionState,
  withSaveResult,
} from "@/components/admin/save-action";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

const MAX_IMAGES = 5;

async function createProduct(
  storeId: string,
  _prev: SaveActionState,
  formData: FormData,
): Promise<SaveActionState> {
  "use server";
  let createdId: string | null = null;
  const result = await withSaveResult(async () => {
    await requireOwnedStore(storeId);
    const data = await parseForm(storeId, formData);
    const created = await db.product.create({
      data: { ...data, storeId },
    });
    createdId = created.id;
    revalidatePath(`/partner/stores/${storeId}/products`);
    revalidatePath(`/app/stores/${storeId}`);
  });
  if (result.ok && createdId) {
    redirect(`/partner/stores/${storeId}/products/${createdId}`);
  }
  return result;
}

async function parseForm(storeId: string, fd: FormData) {
  const cautionsRaw = String(fd.get("cautions") ?? "").trim();

  // 다중 이미지: 커버 이미지와 동일 패턴 (kind 배열 + url/file)
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

export default async function NewProductPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireOwner();
  const store = await requireOwnedStore(params.id);
  return (
    <AdminShell
      userName={user.name || user.email}
      storeName={store.name}
      storeId={store.id}
    >
      <h1 className="ww-disp text-[24px] tracking-[-0.02em] mb-6">
        상품 추가
      </h1>
      <ProductForm action={createProduct.bind(null, store.id)} />
    </AdminShell>
  );
}
