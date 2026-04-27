import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const SLUGS: Array<{ slug: string; defaultTitle: string; description: string }> = [
  {
    slug: "terms",
    defaultTitle: "이용약관",
    description: "회원가입 시 동의하는 서비스 이용약관",
  },
  {
    slug: "privacy",
    defaultTitle: "개인정보처리방침",
    description: "개인정보 수집·이용·제공·보관에 관한 안내",
  },
  {
    slug: "service-info",
    defaultTitle: "서비스 정보",
    description: "사업자 정보·고객센터·앱 버전 등 회사 안내",
  },
];

export default async function AdminLegalListPage() {
  const me = await requireAdmin();
  const docs = await db.legalDoc.findMany();
  const bySlug = new Map(docs.map((d) => [d.slug, d]));

  return (
    <AdminConsoleShell
      title="약관·정책 관리"
      subtitle="앱의 이용약관·개인정보처리방침·서비스 정보를 직접 편집"
      userName={me.name || me.email}
    >
      <div className="grid gap-3 max-w-[820px]">
        {SLUGS.map((s) => {
          const d = bySlug.get(s.slug);
          return (
            <Link
              key={s.slug}
              href={`/admin/legal/${s.slug}`}
              className="bg-white border border-fog rounded-[16px] p-5 hover:border-ink transition flex items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[11px] font-mono text-slate bg-cloud rounded px-2 py-[1px]">
                    {s.slug}
                  </span>
                  <span className="text-[16px] font-extrabold">
                    {d?.title || s.defaultTitle}
                  </span>
                </div>
                <div className="text-[12px] text-slate mb-2">
                  {s.description}
                </div>
                <div className="text-[11px] text-slate ww-num">
                  {d
                    ? `최근 수정 ${format(d.updatedAt, "yyyy-MM-dd HH:mm", { locale: ko })}`
                    : "아직 작성된 내용이 없어요"}
                </div>
              </div>
              <span className="text-slate text-[14px] mt-1">›</span>
            </Link>
          );
        })}
      </div>
    </AdminConsoleShell>
  );
}
