import Link from "next/link";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function togglePinned(id: string, next: boolean) {
  "use server";
  await requireAdmin();
  await db.notice.update({ where: { id }, data: { pinned: next } });
  revalidatePath("/admin/notices");
}

async function deleteNotice(id: string) {
  "use server";
  await requireAdmin();
  await db.notice.delete({ where: { id } });
  revalidatePath("/admin/notices");
}

export default async function NoticesPage() {
  const me = await requireAdmin();
  const notices = await db.notice.findMany({
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
  });

  return (
    <AdminConsoleShell
      title="공지사항"
      subtitle="고객에게 안내되는 공식 공지"
      userName={me.name || me.email}
    >
      <div className="flex justify-end mb-4">
        <Link
          href="/admin/notices/new"
          className="h-11 px-5 inline-flex items-center rounded-full bg-ink text-white text-[13px] font-bold"
        >
          + 새 공지
        </Link>
      </div>

      <div className="bg-white border border-fog rounded-[20px] overflow-hidden">
        {notices.length === 0 ? (
          <div className="py-16 text-center text-slate text-[14px]">
            등록된 공지가 없어요.
          </div>
        ) : (
          <table className="w-full text-[14px]">
            <thead className="bg-paper">
              <tr className="text-left text-slate">
                <Th>{" "}</Th>
                <Th>제목</Th>
                <Th>발행일</Th>
                <Th>작성일</Th>
                <Th className="text-right">관리</Th>
              </tr>
            </thead>
            <tbody>
              {notices.map((n) => (
                <tr key={n.id} className="border-t border-fog">
                  <Td>
                    <form action={togglePinned.bind(null, n.id, !n.pinned)}>
                      <button
                        type="submit"
                        title={n.pinned ? "고정 해제" : "상단 고정"}
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] ${
                          n.pinned
                            ? "bg-warning/10 text-warning"
                            : "text-slate hover:text-ink"
                        }`}
                      >
                        ★
                      </button>
                    </form>
                  </Td>
                  <Td>
                    <Link
                      href={`/admin/notices/${n.id}`}
                      className="font-bold hover:text-accent"
                    >
                      {n.title}
                    </Link>
                    <div className="text-[12px] text-slate line-clamp-1 mt-[2px]">
                      {n.body}
                    </div>
                  </Td>
                  <Td>
                    <span className="ww-num text-[12px]">
                      {n.publishedAt
                        ? format(n.publishedAt, "yyyy-MM-dd", { locale: ko })
                        : "미발행"}
                    </span>
                  </Td>
                  <Td>
                    <span className="ww-num text-[12px] text-slate">
                      {format(n.createdAt, "yyyy-MM-dd")}
                    </span>
                  </Td>
                  <Td className="text-right">
                    <div className="inline-flex gap-3">
                      <Link
                        href={`/admin/notices/${n.id}`}
                        className="text-[12px] font-semibold text-accent hover:underline"
                      >
                        수정
                      </Link>
                      <form action={deleteNotice.bind(null, n.id)}>
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
