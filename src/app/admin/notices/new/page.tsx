import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";
import { NoticeForm } from "../NoticeForm";

export const dynamic = "force-dynamic";

async function createNotice(formData: FormData) {
  "use server";
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const pinned = formData.get("pinned") === "on";
  const publishedAtRaw = String(formData.get("publishedAt") ?? "").trim();
  const publishedAt = publishedAtRaw ? new Date(publishedAtRaw) : new Date();
  if (!title || !body) return;
  await db.notice.create({ data: { title, body, pinned, publishedAt } });
  revalidatePath("/admin/notices");
  redirect("/admin/notices");
}

export default async function NewNoticePage() {
  const me = await requireAdmin();
  return (
    <AdminConsoleShell title="새 공지" userName={me.name || me.email}>
      <NoticeForm action={createNotice} submitLabel="발행하기" />
    </AdminConsoleShell>
  );
}
