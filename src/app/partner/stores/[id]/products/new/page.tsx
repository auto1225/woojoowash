import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/partner/PartnerShell";
import { requireOwnedStore, requireOwner } from "@/lib/admin";
import { db } from "@/lib/db";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

async function createProduct(storeId: string, formData: FormData) {
  "use server";
  await requireOwnedStore(storeId);
  const data = parseForm(formData);
  const created = await db.product.create({
    data: { ...data, storeId },
  });
  revalidatePath(`/partner/stores/${storeId}/products`);
  revalidatePath(`/app/stores/${storeId}`);
  redirect(`/partner/stores/${storeId}/products/${created.id}`);
}

function parseForm(fd: FormData) {
  const imageUrl = String(fd.get("imageUrl") ?? "").trim();
  const cautionsRaw = String(fd.get("cautions") ?? "").trim();
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
    images: imageUrl ? [imageUrl] : [],
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
