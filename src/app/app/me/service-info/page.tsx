import { AppBar } from "@/components/app/AppBar";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AppServiceInfoPage() {
  const doc = await db.legalDoc.findUnique({
    where: { slug: "service-info" },
  });

  return (
    <div className="pb-12">
      <AppBar title="서비스 정보" showBack />
      <article className="px-5 pt-5">
        <h1 className="text-[20px] font-extrabold tracking-[-0.3px] mb-2">
          {doc?.title ?? "서비스 정보"}
        </h1>
        {doc?.updatedAt && (
          <div className="text-[11px] text-slate ww-num mb-4">
            최근 수정 {doc.updatedAt.toISOString().slice(0, 10)}
          </div>
        )}
        <div className="text-[13px] leading-[1.8] text-graphite whitespace-pre-wrap">
          {doc?.body ?? "아직 등록된 내용이 없어요. 관리자 페이지에서 입력해 주세요."}
        </div>
      </article>
    </div>
  );
}
