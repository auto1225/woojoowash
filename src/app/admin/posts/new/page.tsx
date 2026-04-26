import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";
import {
  type SaveActionState,
  withSaveResult,
} from "@/components/admin/save-action";
import { PostForm } from "../PostForm";

export const dynamic = "force-dynamic";

async function createPost(
  _prev: SaveActionState,
  formData: FormData,
): Promise<SaveActionState> {
  "use server";
  let createdId: string | null = null;
  const result = await withSaveResult(async () => {
    await requireAdmin();
    const title = String(formData.get("title") ?? "").trim();
    const body = String(formData.get("body") ?? "").trim();
    const authorName = String(formData.get("authorName") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim() || null;
    const pinned = formData.get("pinned") === "on";
    if (!title || !body || !authorName) {
      throw new Error("제목·본문·작성자를 모두 입력해주세요.");
    }
    const created = await db.post.create({
      data: { title, body, authorName, category, pinned },
    });
    createdId = created.id;
    revalidatePath("/admin/posts");
  });
  if (result.ok && createdId) {
    redirect("/admin/posts");
  }
  return result;
}

export default async function NewPostPage() {
  const me = await requireAdmin();
  return (
    <AdminConsoleShell title="새 게시글" userName={me.name || me.email}>
      <PostForm action={createPost} submitLabel="등록" />
    </AdminConsoleShell>
  );
}
