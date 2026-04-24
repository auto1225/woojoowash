import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";
import { MarketProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

async function updateProduct(id: string, formData: FormData) {
  "use server";
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim() || null;
  const tag = String(formData.get("tag") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  const stockRaw = String(formData.get("stock") ?? "").trim();
  const stock = stockRaw ? Number(stockRaw) : null;
  const active = formData.get("active") === "on";
  if (!name || !imageUrl || !Number.isFinite(price)) return;
  await db.marketProduct.update({
    where: { id },
    data: {
      name,
      price,
      imageUrl,
      category,
      tag,
      description,
      stock,
      active,
    },
  });
  revalidatePath("/admin/shop/products");
  revalidatePath(`/admin/shop/products/${id}`);
  revalidatePath("/app");
  revalidatePath("/app/market");
}

export default async function EditMarketProductPage({
  params,
}: {
  params: { id: string };
}) {
  const me = await requireAdmin();
  const p = await db.marketProduct.findUnique({ where: { id: params.id } });
  if (!p) return notFound();

  return (
    <AdminConsoleShell
      title={p.name}
      subtitle="상품 정보 수정"
      userName={me.name || me.email}
    >
      <MarketProductForm
        action={updateProduct.bind(null, p.id)}
        defaults={{
          name: p.name,
          price: p.price,
          imageUrl: p.imageUrl,
          tag: p.tag ?? "",
          category: p.category ?? "",
          description: p.description ?? "",
          stock: p.stock,
          active: p.active,
        }}
      />
    </AdminConsoleShell>
  );
}
