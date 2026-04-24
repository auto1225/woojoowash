import Link from "next/link";
import { format } from "date-fns";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";
import { StoreRowActions } from "./StoreRowActions";

export const dynamic = "force-dynamic";

export default async function StoresAdminPage() {
  const me = await requireAdmin();
  const stores = await db.store.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      _count: { select: { products: true, reservations: true } },
    },
  });
  const owners = await db.user.findMany({
    where: { role: { in: ["OWNER", "ADMIN"] } },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });

  return (
    <AdminConsoleShell  userName={me.name || me.email}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="ww-disp text-[24px] tracking-[-0.02em]">전체 매장</h1>
        <div className="text-[12px] text-slate">{stores.length}개</div>
      </div>

      <div className="bg-white border border-fog rounded-[20px] overflow-hidden">
        <table className="w-full text-[14px]">
          <thead className="bg-paper">
            <tr className="text-left text-slate">
              <Th>매장</Th>
              <Th>상태</Th>
              <Th>소유자</Th>
              <Th>상품</Th>
              <Th>누적예약</Th>
              <Th>등록일</Th>
              <Th className="text-right">관리</Th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s.id} className="border-t border-fog align-top">
                <Td>
                  <div className="font-bold">{s.name}</div>
                  <div className="text-[12px] text-slate">{s.address}</div>
                </Td>
                <Td>
                  <span
                    className={`text-[11px] font-bold px-2 py-[3px] rounded-full ${
                      s.open
                        ? "bg-success/10 text-success"
                        : "bg-fog text-slate"
                    }`}
                  >
                    {s.open ? "영업중" : "영업종료"}
                  </span>
                </Td>
                <Td>
                  {s.owner ? (
                    <>
                      <div className="text-[13px] font-semibold">
                        {s.owner.name || "(이름 없음)"}
                      </div>
                      <div className="text-[11px] text-slate">{s.owner.email}</div>
                    </>
                  ) : (
                    <span className="text-[11px] text-slate">미지정</span>
                  )}
                </Td>
                <Td>
                  <span className="ww-num">{s._count.products}</span>
                </Td>
                <Td>
                  <span className="ww-num">{s._count.reservations}</span>
                </Td>
                <Td>
                  <span className="text-[12px] text-slate ww-num">
                    {format(s.createdAt, "yyyy-MM-dd")}
                  </span>
                </Td>
                <Td className="text-right">
                  <div className="inline-flex gap-2 items-center">
                    <StoreRowActions
                      storeId={s.id}
                      ownerId={s.ownerId}
                      open={s.open}
                      owners={owners}
                    />
                    <Link
                      href={`/partner/stores/${s.id}`}
                      className="text-[12px] font-semibold text-accent hover:underline"
                    >
                      관리자로 이동
                    </Link>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
  return <td className={`py-4 px-4 ${className ?? ""}`}>{children}</td>;
}
