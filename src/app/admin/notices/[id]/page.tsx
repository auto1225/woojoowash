import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";
import { NoticeForm } from "../NoticeForm";

export const dynamic = "force-dynamic";

async function updateNotice(id: string, formData: FormData) {
  "use server";
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const pinned = formData.get("pinned") === "on";
  const publishedAtRaw = String(formData.get("publishedAt") ?? "").trim();
  const publishedAt = publishedAtRaw ? new Date(publishedAtRaw) : null;
  if (!title || !body) return;
  await db.notice.update({
    where: { id },
    data: { title, body, pinned, publishedAt },
  });
  revalidatePath("/admin/notices");
  revalidatePath(`/admin/notices/${id}`);
}

export default async function EditNoticePage({
  params,
}: {
  params: { id: string };
}) {
  const me = await requireAdmin();
  const notice = await db.notice.findUnique({ where: { id: params.id } });
  if (!notice) return notFound();

  return (
    <AdminConsoleShell
      title={notice.title}
      subtitle="공지 수정"
      userName={me.name || me.email}
    >
      <NoticeForm
        action={updateNotice.bind(null, notice.id)}
        defaults={{
          title: notice.title,
          body: notice.body,
          pinned: notice.pinned,
          publishedAt: notice.publishedAt
            ? notice.publishedAt.toISOString().slice(0, 10)
            : "",
        }}
      />
    </AdminConsoleShell>
  );
}
