import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";
import type { TicketStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<TicketStatus, string> = {
  OPEN: "상담중",
  ANSWERED: "답변 완료",
  CLOSED: "종료",
};

const STATUS_COLOR: Record<TicketStatus, string> = {
  OPEN: "bg-accent/10 text-accent-deep",
  ANSWERED: "bg-success/10 text-success",
  CLOSED: "bg-fog text-slate",
};

export default async function SupportInboxPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const me = await requireAdmin();
  const filter = searchParams.status as TicketStatus | undefined;
  const validStatus =
    filter && ["OPEN", "ANSWERED", "CLOSED"].includes(filter);

  const tickets = await db.supportTicket.findMany({
    where: validStatus ? { status: filter } : {},
    orderBy: [{ adminUnread: "desc" }, { lastMessageAt: "desc" }],
    include: {
      user: { select: { name: true, email: true, phone: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  const counts = await db.supportTicket.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  const countMap = Object.fromEntries(
    counts.map((c) => [c.status, c._count._all]),
  );

  return (
    <AdminConsoleShell
      title="1:1 문의"
      subtitle="고객 채팅 문의에 실시간으로 답변합니다"
      userName={me.name || me.email}
    >
      <div className="flex gap-2 mb-5">
        {[
          { k: "", l: "전체" },
          { k: "OPEN", l: "상담중" },
          { k: "ANSWERED", l: "답변 완료" },
          { k: "CLOSED", l: "종료" },
        ].map((t) => {
          const active = (filter ?? "") === t.k;
          const count = t.k ? countMap[t.k as TicketStatus] ?? 0 : undefined;
          return (
            <a
              key={t.l}
              href={t.k ? `?status=${t.k}` : "?"}
              className={`text-[13px] font-semibold px-4 py-[7px] rounded-full border flex items-center gap-2 ${
                active
                  ? "bg-ink text-white border-ink"
                  : "bg-white border-fog text-graphite"
              }`}
            >
              {t.l}
              {typeof count === "number" && count > 0 && (
                <span
                  className={`text-[10px] font-bold ww-num ${active ? "text-white" : "text-slate"}`}
                >
                  {count}
                </span>
              )}
            </a>
          );
        })}
      </div>

      <div className="bg-white border border-fog rounded-[20px] overflow-hidden">
        {tickets.length === 0 ? (
          <div className="py-16 text-center text-slate text-[14px]">
            조회된 문의가 없어요.
          </div>
        ) : (
          <ul className="divide-y divide-fog">
            {tickets.map((t) => {
              const last = t.messages[0];
              return (
                <li key={t.id}>
                  <Link
                    href={`/admin/support/${t.id}`}
                    className="flex items-center gap-4 p-5 hover:bg-paper transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-ink text-white flex items-center justify-center text-[14px] font-bold shrink-0">
                      {(t.user.name || t.user.email || "U")[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[14px] font-bold">
                          {t.user.name || t.user.email || "고객"}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-[3px] rounded-full ${STATUS_COLOR[t.status]}`}
                        >
                          {STATUS_LABEL[t.status]}
                        </span>
                        {t.adminUnread > 0 && (
                          <span className="text-[10px] font-bold bg-danger text-white px-2 py-[3px] rounded-full ww-num">
                            새 메시지 {t.adminUnread}
                          </span>
                        )}
                      </div>
                      <div className="text-[12px] text-slate truncate">
                        {last
                          ? `${last.sender === "CUSTOMER" ? "고객" : last.sender === "ADMIN" ? "나" : ""}${last.sender !== "SYSTEM" ? ": " : ""}${last.body}`
                          : "(메시지 없음)"}
                      </div>
                    </div>
                    <div className="text-[11px] text-slate shrink-0">
                      {formatDistanceToNow(t.lastMessageAt, {
                        addSuffix: true,
                        locale: ko,
                      })}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AdminConsoleShell>
  );
}
