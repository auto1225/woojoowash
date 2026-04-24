import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";
import { PostForm } from "../PostForm";

export const dynamic = "force-dynamic";

async function updatePost(id: string, formData: FormData) {
  "use server";
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const authorName = String(formData.get("authorName") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim() || null;
  const pinned = formData.get("pinned") === "on";
  if (!title || !body || !authorName) return;
  await db.post.update({
    where: { id },
    data: { title, body, authorName, category, pinned },
  });
  revalidatePath("/admin/posts");
  revalidatePath(`/admin/posts/${id}`);
}

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const me = await requireAdmin();
  const p = await db.post.findUnique({ where: { id: params.id } });
  if (!p) return notFound();

  return (
    <AdminConsoleShell
      title={p.title}
      subtitle={`${p.authorName} 게시글`}
      userName={me.name || me.email}
    >
      <PostForm
        action={updatePost.bind(null, p.id)}
        defaults={{
          title: p.title,
          body: p.body,
          authorName: p.authorName,
          category: p.category ?? "",
          pinned: p.pinned,
        }}
      />
    </AdminConsoleShell>
  );
}
