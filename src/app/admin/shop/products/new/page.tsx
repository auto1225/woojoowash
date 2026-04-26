import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";
import {
  type SaveActionState,
  withSaveResult,
} from "@/components/admin/save-action";
import { MarketProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

async function createProduct(
  _prev: SaveActionState,
  formData: FormData,
): Promise<SaveActionState> {
  "use server";
  let createdId: string | null = null;
  const result = await withSaveResult(async () => {
    await requireAdmin();
    const name = String(formData.get("name") ?? "").trim();
    const price = Number(formData.get("price") ?? 0);
    const imageUrl = String(formData.get("imageUrl") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim() || null;
    const tag = String(formData.get("tag") ?? "").trim() || null;
    const description =
      String(formData.get("description") ?? "").trim() || null;
    const stockRaw = String(formData.get("stock") ?? "").trim();
    const stock = stockRaw ? Number(stockRaw) : null;
    const active = formData.get("active") === "on";
    if (!name || !imageUrl || !Number.isFinite(price)) {
      throw new Error("상품명·가격·대표 이미지 URL 은 필수예요.");
    }
    const count = await db.marketProduct.count();
    const created = await db.marketProduct.create({
      data: {
        name,
        price,
        imageUrl,
        category,
        tag,
        description,
        stock,
        active,
        order: count,
      },
    });
    createdId = created.id;
    revalidatePath("/admin/shop/products");
    revalidatePath("/app");
    revalidatePath("/app/market");
  });
  if (result.ok && createdId) {
    redirect("/admin/shop/products");
  }
  return result;
}

export default async function NewMarketProductPage() {
  const me = await requireAdmin();
  return (
    <AdminConsoleShell title="새 상품" userName={me.name || me.email}>
      <MarketProductForm action={createProduct} submitLabel="등록" />
    </AdminConsoleShell>
  );
}
