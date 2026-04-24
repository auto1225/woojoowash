import Link from "next/link";
import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/partner/PartnerShell";
import { requireOwnedStore, requireOwner } from "@/lib/admin";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function deleteProduct(storeId: string, productId: string) {
  "use server";
  await requireOwnedStore(storeId);
  await db.product.delete({ where: { id: productId } });
  revalidatePath(`/partner/stores/${storeId}/products`);
  revalidatePath(`/app/stores/${storeId}`);
}

export default async function ProductsPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireOwner();
  const store = await requireOwnedStore(params.id);
  const products = await db.product.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminShell
      userName={user.name || user.email}
      storeName={store.name}
      storeId={store.id}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="ww-disp text-[24px] tracking-[-0.02em]">상품 관리</h1>
        <Link
          href={`/partner/stores/${store.id}/products/new`}
          className="h-11 px-5 inline-flex items-center rounded-full bg-ink text-white text-[13px] font-bold"
        >
          + 상품 추가
        </Link>
      </div>

      <div className="bg-white border border-fog rounded-[20px] overflow-hidden">
        {products.length === 0 ? (
          <div className="py-16 text-center text-slate text-[14px]">
            아직 상품이 없어요. 상품을 추가하면 앱에서 고객이 예약할 수
            있어요.
          </div>
        ) : (
          <table className="w-full text-[14px]">
            <thead className="bg-paper">
              <tr className="text-left text-slate">
                <Th>상품</Th>
                <Th>유형</Th>
                <Th>소요</Th>
                <Th>가격</Th>
                <Th className="text-right">관리</Th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-fog">
                  <Td>
                    <div className="font-bold">{p.title}</div>
                    {p.subtitle && (
                      <div className="text-[12px] text-slate mt-[2px]">
                        {p.subtitle}
                      </div>
                    )}
                  </Td>
                  <Td>
                    <span className="text-[11px] font-bold bg-cloud text-graphite px-2 py-[3px] rounded-full">
                      {p.type}
                    </span>
                  </Td>
                  <Td>
                    <span className="ww-num">{p.durationMin}분</span>
                  </Td>
                  <Td>
                    <span className="ww-num font-semibold">
                      {p.price.toLocaleString("ko-KR")}원
                    </span>
                  </Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/partner/stores/${store.id}/products/${p.id}`}
                        className="text-[12px] font-semibold text-accent hover:underline"
                      >
                        수정
                      </Link>
                      <form
                        action={deleteProduct.bind(null, store.id, p.id)}
                      >
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
        )}
      </div>
    </AdminShell>
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
  return <td className={`py-4 px-4 ${className ?? ""}`}>{children}</td>;
}
