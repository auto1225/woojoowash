import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/partner/PartnerShell";
import { requireOwnedStore, requireOwner } from "@/lib/admin";
import { db } from "@/lib/db";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

async function updateProduct(
  storeId: string,
  productId: string,
  formData: FormData,
) {
  "use server";
  await requireOwnedStore(storeId);
  const data = parseForm(formData);
  await db.product.update({ where: { id: productId }, data });
  revalidatePath(`/partner/stores/${storeId}/products`);
  revalidatePath(`/partner/stores/${storeId}/products/${productId}`);
  revalidatePath(`/app/stores/${storeId}`);
  revalidatePath(`/app/stores/${storeId}/products/${productId}`);
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

  const imageUrl = Array.isArray(product.images)
    ? ((product.images as string[])[0] ?? "")
    : "";

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
          imageUrl,
          cautions: product.cautions.join("\n"),
        }}
      />
    </AdminShell>
  );
}
