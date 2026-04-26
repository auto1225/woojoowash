import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";
import {
  type SaveActionState,
  withSaveResult,
} from "@/components/admin/save-action";
import { NoticeForm } from "../NoticeForm";

export const dynamic = "force-dynamic";

async function createNotice(
  _prev: SaveActionState,
  formData: FormData,
): Promise<SaveActionState> {
  "use server";
  let createdId: string | null = null;
  const result = await withSaveResult(async () => {
    await requireAdmin();
    const title = String(formData.get("title") ?? "").trim();
    const body = String(formData.get("body") ?? "").trim();
    const pinned = formData.get("pinned") === "on";
    const publishedAtRaw = String(formData.get("publishedAt") ?? "").trim();
    const publishedAt = publishedAtRaw ? new Date(publishedAtRaw) : new Date();
    if (!title || !body) {
      throw new Error("제목과 본문을 모두 입력해주세요.");
    }
    const created = await db.notice.create({
      data: { title, body, pinned, publishedAt },
    });
    createdId = created.id;
    revalidatePath("/admin/notices");
  });
  if (result.ok && createdId) {
    redirect("/admin/notices");
  }
  return result;
}

export default async function NewNoticePage() {
  const me = await requireAdmin();
  return (
    <AdminConsoleShell title="새 공지" userName={me.name || me.email}>
      <NoticeForm action={createNotice} submitLabel="발행하기" />
    </AdminConsoleShell>
  );
}
