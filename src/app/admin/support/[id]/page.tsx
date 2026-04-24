import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";
import { markAdminRead } from "../actions";
import { AdminChat } from "./AdminChat";

export const dynamic = "force-dynamic";

export default async function AdminTicketPage({
  params,
}: {
  params: { id: string };
}) {
  const me = await requireAdmin();
  const ticket = await db.supportTicket.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, email: true, phone: true, createdAt: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!ticket) return notFound();

  if (ticket.adminUnread > 0) {
    await markAdminRead(ticket.id);
  }

  const customerTicketCount = await db.supportTicket.count({
    where: { userId: ticket.userId },
  });

  return (
    <AdminConsoleShell
      title={`${ticket.user.name || ticket.user.email || "고객"} 문의`}
      subtitle={`문의번호 ${ticket.id.slice(-8).toUpperCase()} · ${format(ticket.createdAt, "yyyy-MM-dd HH:mm", { locale: ko })} 시작`}
      userName={me.name || me.email}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <AdminChat
          ticketId={ticket.id}
          currentStatus={ticket.status}
          initial={ticket.messages.map((m) => ({
            id: m.id,
            sender: m.sender,
            body: m.body,
            createdAt: m.createdAt.toISOString(),
          }))}
        />

        <aside className="flex flex-col gap-4">
          <div className="bg-white border border-fog rounded-[16px] p-5">
            <div className="text-[13px] font-bold mb-3">고객 정보</div>
            <div className="text-[14px] font-bold">
              {ticket.user.name || "(이름 없음)"}
            </div>
            <div className="text-[12px] text-slate mt-1">
              {ticket.user.email}
            </div>
            {ticket.user.phone && (
              <div className="text-[12px] text-slate ww-num mt-1">
                {ticket.user.phone}
              </div>
            )}
            <div className="text-[11px] text-slate mt-3 pt-3 border-t border-fog">
              가입일:{" "}
              <span className="ww-num">
                {format(ticket.user.createdAt, "yyyy-MM-dd")}
              </span>
            </div>
            <div className="text-[11px] text-slate mt-1">
              누적 문의: {customerTicketCount}건
            </div>
          </div>
        </aside>
      </div>
    </AdminConsoleShell>
  );
}
