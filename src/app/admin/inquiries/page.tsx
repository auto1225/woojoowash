import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";
import { InquiryRow } from "./InquiryRow";

export const dynamic = "force-dynamic";

const STATUS_LABEL = {
  NEW: "신규",
  CONTACTED: "상담중",
  APPROVED: "승인",
  REJECTED: "반려",
} as const;

export default async function InquiriesAdminPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const me = await requireAdmin();
  const filter = searchParams.status;
  const validStatus =
    filter === "NEW" ||
    filter === "CONTACTED" ||
    filter === "APPROVED" ||
    filter === "REJECTED";

  const inquiries = await db.partnerInquiry.findMany({
    where: validStatus ? { status: filter as any } : {},
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminConsoleShell active="inquiries" userName={me.name || me.email}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="ww-disp text-[24px] tracking-[-0.02em]">제휴 문의</h1>
        <div className="text-[12px] text-slate">{inquiries.length}건</div>
      </div>

      <div className="flex gap-2 mb-5">
        {[
          { k: "", l: "전체" },
          { k: "NEW", l: "신규" },
          { k: "CONTACTED", l: "상담중" },
          { k: "APPROVED", l: "승인" },
          { k: "REJECTED", l: "반려" },
        ].map((t) => {
          const active = (filter ?? "") === t.k;
          return (
            <a
              key={t.l}
              href={t.k ? `?status=${t.k}` : "?"}
              className={`text-[13px] font-semibold px-4 py-[7px] rounded-full border ${
                active
                  ? "bg-ink text-white border-ink"
                  : "bg-white border-fog text-graphite"
              }`}
            >
              {t.l}
            </a>
          );
        })}
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white border border-fog rounded-[20px] py-16 text-center text-slate text-[14px]">
          문의가 없어요.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {inquiries.map((i) => (
            <InquiryRow
              key={i.id}
              inquiry={{
                id: i.id,
                storeName: i.storeName,
                contactName: i.contactName,
                phone: i.phone,
                address: i.address,
                message: i.message,
                status: i.status,
                memo: i.memo,
                createdAtLabel: format(i.createdAt, "yyyy-MM-dd HH:mm", {
                  locale: ko,
                }),
              }}
              statusLabel={STATUS_LABEL}
            />
          ))}
        </div>
      )}
    </AdminConsoleShell>
  );
}
