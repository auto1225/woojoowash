import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";
import { PostForm } from "../PostForm";

export const dynamic = "force-dynamic";

async function createPost(formData: FormData) {
  "use server";
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const authorName = String(formData.get("authorName") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim() || null;
  const pinned = formData.get("pinned") === "on";
  if (!title || !body || !authorName) return;
  await db.post.create({
    data: { title, body, authorName, category, pinned },
  });
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export default async function NewPostPage() {
  const me = await requireAdmin();
  return (
    <AdminConsoleShell title="새 게시글" userName={me.name || me.email}>
      <PostForm action={createPost} submitLabel="등록" />
    </AdminConsoleShell>
  );
}
