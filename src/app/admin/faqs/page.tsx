import { revalidatePath } from "next/cache";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";
import { FaqRow } from "./FaqRow";

export const dynamic = "force-dynamic";

async function createFaq(formData: FormData) {
  "use server";
  await requireAdmin();
  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim() || null;
  if (!question || !answer) return;
  const count = await db.faq.count();
  await db.faq.create({
    data: { question, answer, category, order: count, active: true },
  });
  revalidatePath("/admin/faqs");
  revalidatePath("/home");
  revalidatePath("/support");
}

async function updateFaq(id: string, formData: FormData) {
  "use server";
  await requireAdmin();
  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim() || null;
  const active = formData.get("active") === "on";
  if (!question || !answer) return;
  await db.faq.update({
    where: { id },
    data: { question, answer, category, active },
  });
  revalidatePath("/admin/faqs");
  revalidatePath("/home");
  revalidatePath("/support");
}

async function deleteFaq(id: string) {
  "use server";
  await requireAdmin();
  await db.faq.delete({ where: { id } });
  revalidatePath("/admin/faqs");
  revalidatePath("/home");
  revalidatePath("/support");
}

export default async function FaqsPage() {
  const me = await requireAdmin();
  const faqs = await db.faq.findMany({ orderBy: { order: "asc" } });

  return (
    <AdminConsoleShell
      title="FAQ 관리"
      subtitle="홈페이지와 고객센터에 노출되는 자주 묻는 질문"
      userName={me.name || me.email}
    >
      <section className="bg-white border border-fog rounded-[20px] p-6 mb-6">
        <div className="text-[15px] font-extrabold mb-4">새 FAQ 추가</div>
        <form action={createFaq} className="grid gap-3">
          <div className="grid md:grid-cols-[160px_1fr] gap-3">
            <input
              type="text"
              name="category"
              placeholder="카테고리 (예: 예약)"
              className="h-11 px-3 bg-paper border border-fog rounded-[10px] text-[14px]"
            />
            <input
              type="text"
              name="question"
              required
              placeholder="질문"
              className="h-11 px-3 bg-paper border border-fog rounded-[10px] text-[14px]"
            />
          </div>
          <textarea
            name="answer"
            required
            rows={3}
            placeholder="답변"
            className="p-3 bg-paper border border-fog rounded-[10px] text-[14px] resize-none"
          />
          <button
            type="submit"
            className="self-start h-10 px-5 rounded-full bg-ink text-white font-bold text-[13px]"
          >
            추가
          </button>
        </form>
      </section>

      {faqs.length === 0 ? (
        <div className="bg-white border border-fog rounded-[20px] py-16 text-center text-slate text-[14px]">
          등록된 FAQ가 없어요.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {faqs.map((f) => (
            <FaqRow
              key={f.id}
              faq={{
                id: f.id,
                category: f.category,
                question: f.question,
                answer: f.answer,
                active: f.active,
              }}
              updateAction={updateFaq.bind(null, f.id)}
              deleteAction={deleteFaq.bind(null, f.id)}
            />
          ))}
        </div>
      )}
    </AdminConsoleShell>
  );
}
