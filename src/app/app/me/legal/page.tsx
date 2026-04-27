import { AppBar } from "@/components/app/AppBar";
import { db } from "@/lib/db";
import { LegalTabs, type LegalDocView } from "./LegalTabs";

export const dynamic = "force-dynamic";

export default async function AppLegalPage() {
  const docs = await db.legalDoc.findMany({
    where: { slug: { in: ["terms", "privacy"] } },
  });
  const map = new Map(docs.map((d) => [d.slug, d]));
  const terms = map.get("terms");
  const privacy = map.get("privacy");

  const items: LegalDocView[] = [
    {
      slug: "terms",
      label: "이용약관",
      title: terms?.title ?? "이용약관",
      body: terms?.body ?? "아직 등록된 내용이 없어요.",
      updatedAt: terms?.updatedAt.toISOString() ?? null,
    },
    {
      slug: "privacy",
      label: "개인정보처리방침",
      title: privacy?.title ?? "개인정보처리방침",
      body: privacy?.body ?? "아직 등록된 내용이 없어요.",
      updatedAt: privacy?.updatedAt.toISOString() ?? null,
    },
  ];

  return (
    <div className="pb-12">
      <AppBar title="이용약관·개인정보처리방침" showBack />
      <LegalTabs items={items} />
    </div>
  );
}
