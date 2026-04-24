import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";
import { UserRowActions } from "./UserRowActions";

export const dynamic = "force-dynamic";

export default async function UsersAdminPage({
  searchParams,
}: {
  searchParams: { q?: string; role?: string; status?: string };
}) {
  const me = await requireAdmin();
  const q = (searchParams.q ?? "").trim();
  const role = searchParams.role;
  const status = searchParams.status;

  const users = await db.user.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { email: { contains: q, mode: "insensitive" } },
                { name: { contains: q, mode: "insensitive" } },
                { phone: { contains: q } },
              ],
            }
          : {},
        role && ["USER", "OWNER", "ADMIN"].includes(role) ? { role: role as any } : {},
        status === "ACTIVE" || status === "SUSPENDED"
          ? { status: status as any }
          : {},
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      _count: {
        select: { reservations: true, ownedStores: true },
      },
    },
  });

  return (
    <AdminConsoleShell active="users" userName={me.name || me.email}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="ww-disp text-[24px] tracking-[-0.02em]">회원 관리</h1>
        <div className="text-[12px] text-slate">{users.length}명</div>
      </div>

      <form className="flex flex-wrap gap-2 mb-5 items-center">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="이메일·이름·전화번호 검색"
          className="h-10 px-4 bg-white border border-fog rounded-full text-[13px] w-[280px] outline-none focus:border-ink"
        />
        <select
          name="role"
          defaultValue={role ?? ""}
          className="h-10 px-3 bg-white border border-fog rounded-full text-[13px]"
        >
          <option value="">전체 역할</option>
          <option value="USER">일반</option>
          <option value="OWNER">매장 운영자</option>
          <option value="ADMIN">서비스 관리자</option>
        </select>
        <select
          name="status"
          defaultValue={status ?? ""}
          className="h-10 px-3 bg-white border border-fog rounded-full text-[13px]"
        >
          <option value="">전체 상태</option>
          <option value="ACTIVE">정상</option>
          <option value="SUSPENDED">정지</option>
        </select>
        <button
          type="submit"
          className="h-10 px-5 rounded-full bg-ink text-white text-[13px] font-bold"
        >
          검색
        </button>
        <a
          href="/admin/users"
          className="h-10 px-4 inline-flex items-center rounded-full text-[12px] text-slate font-semibold hover:text-ink"
        >
          초기화
        </a>
      </form>

      <div className="bg-white border border-fog rounded-[20px] overflow-hidden">
        {users.length === 0 ? (
          <div className="py-16 text-center text-slate text-[14px]">
            조회된 회원이 없어요.
          </div>
        ) : (
          <table className="w-full text-[14px]">
            <thead className="bg-paper">
              <tr className="text-left text-slate">
                <Th>회원</Th>
                <Th>역할</Th>
                <Th>상태</Th>
                <Th>예약</Th>
                <Th>매장</Th>
                <Th>가입일</Th>
                <Th className="text-right">관리</Th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-fog align-top">
                  <Td>
                    <div className="font-bold">{u.name || "(이름 없음)"}</div>
                    <div className="text-[12px] text-slate">{u.email}</div>
                    {u.phone && (
                      <div className="text-[11px] text-slate ww-num">{u.phone}</div>
                    )}
                  </Td>
                  <Td>
                    <RoleTag role={u.role} />
                  </Td>
                  <Td>
                    <StatusTag status={u.status} />
                  </Td>
                  <Td>
                    <span className="ww-num">{u._count.reservations}</span>
                  </Td>
                  <Td>
                    <span className="ww-num">{u._count.ownedStores}</span>
                  </Td>
                  <Td>
                    <span className="text-[12px] text-slate ww-num">
                      {format(u.createdAt, "yyyy-MM-dd", { locale: ko })}
                    </span>
                  </Td>
                  <Td className="text-right">
                    <UserRowActions
                      userId={u.id}
                      role={u.role}
                      status={u.status}
                      selfId={me.id}
                    />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminConsoleShell>
  );
}

function RoleTag({ role }: { role: "USER" | "OWNER" | "ADMIN" }) {
  const map = {
    USER: { l: "일반", c: "bg-cloud text-graphite" },
    OWNER: { l: "운영자", c: "bg-accent/10 text-accent-deep" },
    ADMIN: { l: "관리자", c: "bg-ink text-white" },
  };
  const x = map[role];
  return (
    <span className={`text-[11px] font-bold px-2 py-[3px] rounded-full ${x.c}`}>
      {x.l}
    </span>
  );
}

function StatusTag({ status }: { status: "ACTIVE" | "SUSPENDED" }) {
  const x =
    status === "ACTIVE"
      ? { l: "정상", c: "bg-success/10 text-success" }
      : { l: "정지", c: "bg-danger/10 text-danger" };
  return (
    <span className={`text-[11px] font-bold px-2 py-[3px] rounded-full ${x.c}`}>
      {x.l}
    </span>
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
