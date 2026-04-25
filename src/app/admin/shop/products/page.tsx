import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function toggleActive(id: string, next: boolean) {
  "use server";
  await requireAdmin();
  await db.marketProduct.update({ where: { id }, data: { active: next } });
  revalidatePath("/admin/shop/products");
  revalidatePath("/app");
  revalidatePath("/app/market");
}

async function reorder(id: string, delta: number) {
  "use server";
  await requireAdmin();
  const all = await db.marketProduct.findMany({ orderBy: { order: "asc" } });
  const idx = all.findIndex((x) => x.id === id);
  if (idx < 0) return;
  const swapIdx = idx + delta;
  if (swapIdx < 0 || swapIdx >= all.length) return;
  await db.$transaction([
    db.marketProduct.update({
      where: { id: all[idx].id },
      data: { order: all[swapIdx].order },
    }),
    db.marketProduct.update({
      where: { id: all[swapIdx].id },
      data: { order: all[idx].order },
    }),
  ]);
  revalidatePath("/admin/shop/products");
  revalidatePath("/app");
  revalidatePath("/app/market");
}

async function deleteProduct(id: string) {
  "use server";
  await requireAdmin();
  await db.marketProduct.delete({ where: { id } });
  revalidatePath("/admin/shop/products");
  revalidatePath("/app");
  revalidatePath("/app/market");
}

export default async function ShopProductsPage() {
  const me = await requireAdmin();
  const products = await db.marketProduct.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <AdminConsoleShell
      title="상품 관리"
      subtitle="앱 홈 마켓 섹션과 /app/market 페이지에 노출되는 상품"
      userName={me.name || me.email}
    >
      <div className="flex justify-end mb-4">
        <Link
          href="/admin/shop/products/new"
          className="h-11 px-5 inline-flex items-center rounded-full btn-brand text-[13px]"
        >
          + 새 상품
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white border border-fog rounded-[20px] py-16 text-center text-slate text-[14px]">
          등록된 상품이 없어요.
        </div>
      ) : (
        <div className="bg-white border border-fog rounded-[20px] overflow-hidden">
          <table className="w-full text-[14px]">
            <thead className="bg-paper">
              <tr className="text-left text-slate">
                <Th>상품</Th>
                <Th>카테고리</Th>
                <Th>가격</Th>
                <Th>뱃지</Th>
                <Th>재고</Th>
                <Th>상태</Th>
                <Th className="text-right">관리</Th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id} className="border-t border-fog align-middle">
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-[10px] overflow-hidden bg-cloud shrink-0">
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="50px"
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/shop/products/${p.id}`}
                          className="font-bold hover:text-accent truncate block"
                        >
                          {p.name}
                        </Link>
                        <div className="text-[11px] text-slate ww-num">
                          순서 {i + 1}
                        </div>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    {p.category && (
                      <span className="text-[11px] font-bold bg-cloud text-graphite px-2 py-[3px] rounded-full">
                        {p.category}
                      </span>
                    )}
                  </Td>
                  <Td>
                    <span className="ww-num font-semibold">
                      {p.price.toLocaleString("ko-KR")}원
                    </span>
                  </Td>
                  <Td>
                    {p.tag && (
                      <span
                        className={`text-[10px] font-bold px-2 py-[3px] rounded-full ${
                          p.tag === "BEST"
                            ? "bg-ink text-white"
                            : p.tag === "NEW"
                              ? "bg-accent text-white"
                              : "bg-warning text-white"
                        }`}
                      >
                        {p.tag}
                      </span>
                    )}
                  </Td>
                  <Td>
                    <span className="ww-num">
                      {p.stock !== null ? p.stock : "∞"}
                    </span>
                  </Td>
                  <Td>
                    <form action={toggleActive.bind(null, p.id, !p.active)}>
                      <button
                        type="submit"
                        className={`text-[11px] font-bold px-2 py-[3px] rounded-full ${
                          p.active
                            ? "bg-success/10 text-success"
                            : "bg-fog text-slate"
                        }`}
                      >
                        {p.active ? "노출" : "숨김"}
                      </button>
                    </form>
                  </Td>
                  <Td className="text-right">
                    <div className="inline-flex gap-2 items-center">
                      <form action={reorder.bind(null, p.id, -1)}>
                        <button
                          type="submit"
                          disabled={i === 0}
                          className="w-7 h-7 rounded-full border border-fog text-[12px] disabled:opacity-30"
                        >
                          ↑
                        </button>
                      </form>
                      <form action={reorder.bind(null, p.id, 1)}>
                        <button
                          type="submit"
                          disabled={i === products.length - 1}
                          className="w-7 h-7 rounded-full border border-fog text-[12px] disabled:opacity-30"
                        >
                          ↓
                        </button>
                      </form>
                      <Link
                        href={`/admin/shop/products/${p.id}`}
                        className="text-[12px] font-semibold text-accent hover:underline ml-2"
                      >
                        수정
                      </Link>
                      <form action={deleteProduct.bind(null, p.id)}>
                        <button
                          type="submit"
                          className="text-[12px] font-semibold text-danger hover:underline"
                        >
                          삭제
                        </button>
                      </form>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminConsoleShell>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`text-[11px] font-semibold uppercase tracking-wider py-3 px-4 ${className ?? ""}`}
    >
      {children}
    </th>
  );
}
function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`py-3 px-4 ${className ?? ""}`}>{children}</td>;
}
