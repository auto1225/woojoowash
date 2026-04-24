import Image from "next/image";
import { revalidatePath } from "next/cache";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function createHero(formData: FormData) {
  "use server";
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim() || null;
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const linkHref = String(formData.get("linkHref") ?? "").trim() || null;
  if (!title || !imageUrl) return;
  const count = await db.homeHero.count();
  await db.homeHero.create({
    data: { title, subtitle, imageUrl, linkHref, order: count },
  });
  revalidatePath("/admin/content/hero");
  revalidatePath("/home");
  revalidatePath("/app");
}

async function updateHero(id: string, formData: FormData) {
  "use server";
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim() || null;
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const linkHref = String(formData.get("linkHref") ?? "").trim() || null;
  const active = formData.get("active") === "on";
  if (!title || !imageUrl) return;
  await db.homeHero.update({
    where: { id },
    data: { title, subtitle, imageUrl, linkHref, active },
  });
  revalidatePath("/admin/content/hero");
  revalidatePath("/home");
  revalidatePath("/app");
}

async function deleteHero(id: string) {
  "use server";
  await requireAdmin();
  await db.homeHero.delete({ where: { id } });
  revalidatePath("/admin/content/hero");
  revalidatePath("/home");
  revalidatePath("/app");
}

async function reorderHero(id: string, delta: number) {
  "use server";
  await requireAdmin();
  const all = await db.homeHero.findMany({ orderBy: { order: "asc" } });
  const idx = all.findIndex((x) => x.id === id);
  if (idx < 0) return;
  const swapIdx = idx + delta;
  if (swapIdx < 0 || swapIdx >= all.length) return;
  await db.$transaction([
    db.homeHero.update({
      where: { id: all[idx].id },
      data: { order: all[swapIdx].order },
    }),
    db.homeHero.update({
      where: { id: all[swapIdx].id },
      data: { order: all[idx].order },
    }),
  ]);
  revalidatePath("/admin/content/hero");
  revalidatePath("/home");
  revalidatePath("/app");
}

export default async function HeroContentPage() {
  const me = await requireAdmin();
  const heroes = await db.homeHero.findMany({ orderBy: { order: "asc" } });

  return (
    <AdminConsoleShell
      title="Hero 슬라이드"
      subtitle="랜딩 페이지와 앱 홈 상단에 노출되는 메인 배너"
      userName={me.name || me.email}
    >
      <section className="bg-white border border-fog rounded-[20px] p-6 mb-6">
        <div className="text-[15px] font-extrabold mb-4">새 슬라이드 추가</div>
        <form
          action={createHero}
          className="grid gap-3 md:grid-cols-2"
        >
          <Field label="제목" name="title" required placeholder="예: 빠르게 광내는 법" />
          <Field label="보조 문구" name="subtitle" placeholder="예: 90%가 모르는" />
          <Field
            label="이미지 URL"
            name="imageUrl"
            required
            placeholder="https://…"
            className="md:col-span-2"
          />
          <Field label="링크 (선택)" name="linkHref" placeholder="/pass" />
          <div className="flex items-end">
            <button
              type="submit"
              className="h-11 px-6 rounded-full bg-ink text-white font-bold text-[13px]"
            >
              추가
            </button>
          </div>
        </form>
      </section>

      {heroes.length === 0 ? (
        <div className="bg-white border border-fog rounded-[20px] py-16 text-center text-slate text-[14px]">
          등록된 슬라이드가 없어요.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {heroes.map((h, i) => (
            <div
              key={h.id}
              className="bg-white border border-fog rounded-[20px] overflow-hidden"
            >
              <div className="relative aspect-[15/11] bg-cloud">
                <Image
                  src={h.imageUrl}
                  alt={h.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute left-5 top-5 text-white">
                  {h.subtitle && (
                    <div className="text-[12px] font-bold mb-1 opacity-90">
                      {h.subtitle}
                    </div>
                  )}
                  <div
                    className="ww-disp"
                    style={{ fontSize: 26, lineHeight: 1.1 }}
                  >
                    {h.title}
                  </div>
                </div>
                <div className="absolute right-3 top-3 flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-[3px] rounded-full ${
                      h.active
                        ? "bg-accent text-white"
                        : "bg-ash/90 text-white"
                    }`}
                  >
                    {h.active ? "활성" : "비활성"}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-[3px] rounded-full bg-white/90 text-ink ww-num">
                    {i + 1}
                  </span>
                </div>
              </div>
              <form
                action={updateHero.bind(null, h.id)}
                className="p-5 grid gap-3"
              >
                <Field label="제목" name="title" defaultValue={h.title} required />
                <Field
                  label="보조 문구"
                  name="subtitle"
                  defaultValue={h.subtitle ?? ""}
                />
                <Field
                  label="이미지 URL"
                  name="imageUrl"
                  defaultValue={h.imageUrl}
                  required
                />
                <Field
                  label="링크"
                  name="linkHref"
                  defaultValue={h.linkHref ?? ""}
                />
                <label className="flex items-center gap-2 text-[13px]">
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={h.active}
                    className="w-4 h-4 accent-accent"
                  />
                  활성 (앱·홈페이지에 노출)
                </label>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="h-10 px-5 rounded-full bg-ink text-white font-bold text-[13px]"
                  >
                    저장
                  </button>
                  <button
                    type="submit"
                    formAction={reorderHero.bind(null, h.id, -1)}
                    disabled={i === 0}
                    className="h-10 px-3 rounded-full border border-fog text-[13px] disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="submit"
                    formAction={reorderHero.bind(null, h.id, 1)}
                    disabled={i === heroes.length - 1}
                    className="h-10 px-3 rounded-full border border-fog text-[13px] disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="submit"
                    formAction={deleteHero.bind(null, h.id)}
                    className="h-10 px-5 rounded-full text-danger text-[13px] font-bold ml-auto"
                  >
                    삭제
                  </button>
                </div>
              </form>
            </div>
          ))}
        </div>
      )}
    </AdminConsoleShell>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  className,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-[12px] font-bold mb-[4px] block">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full h-11 px-3 bg-paper border border-fog rounded-[10px] text-[14px] outline-none focus:border-ink"
      />
    </label>
  );
}
