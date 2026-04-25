import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";
import { UserEditForm } from "./UserEditForm";

export const dynamic = "force-dynamic";

export default async function UserEditPage({
  params,
}: {
  params: { id: string };
}) {
  const me = await requireAdmin();
  const user = await db.user.findUnique({
    where: { id: params.id },
    include: {
      _count: {
        select: {
          reservations: true,
          ownedStores: true,
          orders: true,
          supportTickets: true,
        },
      },
    },
  });
  if (!user) return notFound();

  return (
    <AdminConsoleShell userName={me.name || me.email}>
      <div className="mb-6">
        <Link
          href="/admin/users"
          className="text-[12px] text-slate hover:text-ink"
        >
          ← 회원 목록으로
        </Link>
        <h1 className="ww-disp text-[28px] tracking-[-0.02em] mt-2">
          회원 정보 수정
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <UserEditForm
          userId={user.id}
          isSelf={user.id === me.id}
          defaults={{
            name: user.name ?? "",
            email: user.email ?? "",
            phone: user.phone ?? "",
            role: user.role,
            status: user.status,
          }}
        />

        <aside className="bg-white border border-fog rounded-[20px] p-6 h-fit">
          <div className="text-[13px] font-bold mb-4">계정 정보</div>
          <div className="text-[12px] text-slate space-y-2">
            <div className="flex justify-between">
              <span>회원 ID</span>
              <span className="ww-num font-mono text-[11px] text-graphite">
                {user.id.slice(-12)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>가입일</span>
              <span className="ww-num text-graphite">
                {format(user.createdAt, "yyyy-MM-dd", { locale: ko })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>최근 수정</span>
              <span className="ww-num text-graphite">
                {format(user.updatedAt, "yyyy-MM-dd", { locale: ko })}
              </span>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-fog">
            <div className="text-[13px] font-bold mb-3">활동 요약</div>
            <div className="grid grid-cols-2 gap-2">
              <Mini label="예약" value={user._count.reservations} />
              <Mini label="소유 매장" value={user._count.ownedStores} />
              <Mini label="주문" value={user._count.orders} />
              <Mini label="문의" value={user._count.supportTickets} />
            </div>
          </div>
        </aside>
      </div>
    </AdminConsoleShell>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-paper rounded-[10px] py-3 text-center">
      <div className="ww-disp text-[18px] ww-num">{value}</div>
      <div className="text-[11px] text-slate">{label}</div>
    </div>
  );
}
