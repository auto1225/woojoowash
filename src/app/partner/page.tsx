import Link from "next/link";
import { db } from "@/lib/db";
import { getOwnerStores, requireOwner } from "@/lib/admin";
import { AdminShell } from "@/components/partner/PartnerShell";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const user = await requireOwner();
  const stores = await getOwnerStores(user.id, user.role);

  const statsByStore = await Promise.all(
    stores.map(async (s) => {
      const [productCount, upcoming, doneThisMonth] = await Promise.all([
        db.product.count({ where: { storeId: s.id } }),
        db.reservation.count({
          where: { storeId: s.id, status: "CONFIRMED" },
        }),
        db.reservation.count({
          where: {
            storeId: s.id,
            status: "DONE",
            startAt: {
              gte: startOfMonth(),
            },
          },
        }),
      ]);
      return { storeId: s.id, productCount, upcoming, doneThisMonth };
    }),
  );

  return (
    <AdminShell userName={user.name || user.email}>
      <div className="mb-10">
        <div className="text-[12px] font-bold text-accent tracking-[0.15em] mb-3">
          DASHBOARD
        </div>
        <h1 className="ww-disp text-[32px] tracking-[-0.02em]">
          내 매장 관리
        </h1>
        <p className="text-slate text-[14px] mt-2">
          매장 정보·상품·예약을 여기서 한 번에 관리하세요.
        </p>
      </div>

      {stores.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-fog p-16 text-center">
          <div className="text-[15px] text-slate mb-4">
            등록된 매장이 없어요. 우주워시 담당자에게 문의해 주세요.
          </div>
          <a
            href="/partners"
            className="inline-flex h-11 px-5 items-center rounded-full bg-ink text-white text-[13px] font-bold"
          >
            제휴 문의하기
          </a>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stores.map((s) => {
            const stats = statsByStore.find((x) => x.storeId === s.id);
            return (
              <Link
                key={s.id}
                href={`/partner/stores/${s.id}`}
                className="bg-white border border-fog rounded-[20px] p-6 hover:shadow-ww-card transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[17px] font-extrabold tracking-[-0.3px]">
                    {s.name}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-[8px] py-[3px] rounded-full ${
                      s.open
                        ? "bg-accent text-white"
                        : "bg-fog text-slate"
                    }`}
                  >
                    {s.open ? "영업중" : "영업종료"}
                  </span>
                </div>
                <div className="text-[12px] text-slate mb-5">{s.address}</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <Stat label="상품" value={stats?.productCount ?? 0} />
                  <Stat label="예정 예약" value={stats?.upcoming ?? 0} />
                  <Stat
                    label="이번 달 완료"
                    value={stats?.doneThisMonth ?? 0}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-paper rounded-[12px] py-3">
      <div className="ww-disp text-[20px] ww-num">{value}</div>
      <div className="text-[11px] text-slate mt-[2px]">{label}</div>
    </div>
  );
}

function startOfMonth(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
