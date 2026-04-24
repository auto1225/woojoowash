import Link from "next/link";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function togglePinnedPost(id: string, next: boolean) {
  "use server";
  await requireAdmin();
  await db.post.update({ where: { id }, data: { pinned: next } });
  revalidatePath("/admin/posts");
}

async function deletePost(id: string) {
  "use server";
  await requireAdmin();
  await db.post.delete({ where: { id } });
  revalidatePath("/admin/posts");
}

export default async function PostsPage() {
  const me = await requireAdmin();
  const posts = await db.post.findMany({
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
  });

  return (
    <AdminConsoleShell
      title="게시판"
      subtitle="후기·팁·공지 외 일반 게시글"
      userName={me.name || me.email}
    >
      <div className="flex justify-end mb-4">
        <Link
          href="/admin/posts/new"
          className="h-11 px-5 inline-flex items-center rounded-full bg-ink text-white text-[13px] font-bold"
        >
          + 새 글 작성
        </Link>
      </div>

      <div className="bg-white border border-fog rounded-[20px] overflow-hidden">
        {posts.length === 0 ? (
          <div className="py-16 text-center text-slate text-[14px]">
            게시글이 없어요.
          </div>
        ) : (
          <table className="w-full text-[14px]">
            <thead className="bg-paper">
              <tr className="text-left text-slate">
                <Th>{" "}</Th>
                <Th>제목 / 작성자</Th>
                <Th>카테고리</Th>
                <Th>작성일</Th>
                <Th className="text-right">관리</Th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t border-fog">
                  <Td>
                    <form action={togglePinnedPost.bind(null, p.id, !p.pinned)}>
                      <button
                        type="submit"
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] ${
                          p.pinned
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
                      href={`/admin/posts/${p.id}`}
                      className="font-bold hover:text-accent"
                    >
                      {p.title}
                    </Link>
                    <div className="text-[12px] text-slate mt-[2px]">
                      {p.authorName}
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
                    <span className="ww-num text-[12px] text-slate">
                      {format(p.createdAt, "yyyy-MM-dd")}
                    </span>
                  </Td>
                  <Td className="text-right">
                    <div className="inline-flex gap-3">
                      <Link
                        href={`/admin/posts/${p.id}`}
                        className="text-[12px] font-semibold text-accent hover:underline"
                      >
                        수정
                      </Link>
                      <form action={deletePost.bind(null, p.id)}>
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
