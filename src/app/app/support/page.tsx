import Link from "next/link";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { AppBar } from "@/components/app/AppBar";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { startOrResumeTicket } from "./actions";

export const dynamic = "force-dynamic";

const STATUS = {
  OPEN: { l: "상담중", c: "bg-accent/10 text-accent-deep" },
  ANSWERED: { l: "답변 완료", c: "bg-success/10 text-success" },
  CLOSED: { l: "종료", c: "bg-fog text-slate" },
} as const;

export default async function SupportListPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login?callbackUrl=/app/support");

  const tickets = await db.supportTicket.findMany({
    where: { userId: session.user.id },
    orderBy: { lastMessageAt: "desc" },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return (
    <div className="min-h-screen bg-paper pb-[120px]">
      <AppBar title="1:1 문의" />

      <section className="px-5 pt-5">
        <form action={startOrResumeTicket}>
          <button
            type="submit"
            className="h-14 w-full rounded-full bg-accent text-white font-bold text-[15px] shadow-ww-blue"
          >
            새 문의 시작하기
          </button>
        </form>
        <div className="text-[12px] text-slate mt-2 text-center">
          영업일 기준 24시간 이내 답변드려요.
        </div>
      </section>

      {tickets.length > 0 && (
        <section className="px-5 pt-6">
          <div className="text-[13px] font-bold mb-3">내 문의 내역</div>
          <div className="flex flex-col gap-3">
            {tickets.map((t) => {
              const last = t.messages[0];
              return (
                <Link
                  key={t.id}
                  href={`/app/support/${t.id}`}
                  className="bg-white rounded-[14px] border border-fog p-4 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold px-2 py-[3px] rounded-full ${STATUS[t.status].c}`}
                    >
                      {STATUS[t.status].l}
                    </span>
                    <span className="text-[11px] text-slate">
                      {formatDistanceToNow(t.lastMessageAt, {
                        addSuffix: true,
                        locale: ko,
                      })}
                    </span>
                  </div>
                  {t.subject && (
                    <div className="text-[14px] font-bold">{t.subject}</div>
                  )}
                  {last && (
                    <div className="text-[13px] text-slate line-clamp-2">
                      {last.sender === "CUSTOMER" ? "나: " : last.sender === "ADMIN" ? "상담사: " : ""}
                      {last.body}
                    </div>
                  )}
                  {t.customerUnread > 0 && (
                    <div className="flex items-center gap-2 text-[11px] text-accent font-bold">
                      <span className="w-[8px] h-[8px] rounded-full bg-accent" />
                      새 답변 {t.customerUnread}건
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
