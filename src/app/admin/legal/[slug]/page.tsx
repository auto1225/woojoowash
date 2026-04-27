import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";
import {
  type SaveActionState,
  withSaveResult,
} from "@/components/admin/save-action";
import { LegalDocForm } from "./LegalDocForm";

export const dynamic = "force-dynamic";

const VALID_SLUGS = ["terms", "privacy", "service-info"] as const;

const DEFAULTS: Record<string, { title: string }> = {
  terms: { title: "이용약관" },
  privacy: { title: "개인정보처리방침" },
  "service-info": { title: "서비스 정보" },
};

async function saveDoc(
  slug: string,
  _prev: SaveActionState,
  formData: FormData,
): Promise<SaveActionState> {
  "use server";
  return withSaveResult(async () => {
    await requireAdmin();
    if (!VALID_SLUGS.includes(slug as (typeof VALID_SLUGS)[number])) {
      throw new Error("알 수 없는 문서입니다.");
    }
    const title = String(formData.get("title") ?? "").trim();
    const body = String(formData.get("body") ?? "");
    if (!title) throw new Error("제목을 입력해주세요.");
    await db.legalDoc.upsert({
      where: { slug },
      update: { title, body },
      create: { slug, title, body },
    });
    revalidatePath("/admin/legal");
    revalidatePath(`/admin/legal/${slug}`);
    revalidatePath("/app/me/legal");
    revalidatePath("/app/me/service-info");
  });
}

export default async function AdminLegalEditPage({
  params,
}: {
  params: { slug: string };
}) {
  const me = await requireAdmin();
  if (!VALID_SLUGS.includes(params.slug as (typeof VALID_SLUGS)[number])) {
    return notFound();
  }
  const doc = await db.legalDoc.findUnique({ where: { slug: params.slug } });
  const fallback = DEFAULTS[params.slug];

  return (
    <AdminConsoleShell
      title={doc?.title || fallback?.title || params.slug}
      subtitle="앱에 노출되는 본문 — 줄바꿈 그대로 표시됩니다"
      userName={me.name || me.email}
    >
      <LegalDocForm
        slug={params.slug}
        action={saveDoc.bind(null, params.slug)}
        defaults={{
          title: doc?.title ?? fallback?.title ?? "",
          body: doc?.body ?? "",
        }}
      />
    </AdminConsoleShell>
  );
}
