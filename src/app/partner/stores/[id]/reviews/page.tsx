import Image from "next/image";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AdminShell } from "@/components/partner/PartnerShell";
import { requireOwnedStore, requireOwner } from "@/lib/admin";
import { db } from "@/lib/db";
import { ReviewReplyForm } from "./ReviewReplyForm";

export const dynamic = "force-dynamic";

async function saveReply(reviewId: string, reply: string) {
  "use server";
  const text = reply.trim();
  if (!text) throw new Error("답글 내용을 입력해주세요.");
  const review = await db.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new Error("리뷰를 찾을 수 없어요.");
  await requireOwnedStore(review.storeId);
  await db.review.update({
    where: { id: reviewId },
    data: { reply: text, repliedAt: new Date() },
  });
  revalidatePath(`/partner/stores/${review.storeId}/reviews`);
  revalidatePath(`/app/stores/${review.storeId}`);
}

async function deleteReply(reviewId: string) {
  "use server";
  const review = await db.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new Error("리뷰를 찾을 수 없어요.");
  await requireOwnedStore(review.storeId);
  await db.review.update({
    where: { id: reviewId },
    data: { reply: null, repliedAt: null },
  });
  revalidatePath(`/partner/stores/${review.storeId}/reviews`);
  revalidatePath(`/app/stores/${review.storeId}`);
}

export default async function ReviewsAdminPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireOwner();
  const store = await requireOwnedStore(params.id);

  const reviews = await db.review.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      reservation: {
        select: {
          startAt: true,
          product: { select: { title: true } },
        },
      },
    },
  });

  // 통계
  const totalCount = reviews.length;
  const repliedCount = reviews.filter((r) => r.reply).length;
  const avgRating =
    totalCount === 0
      ? 0
      : reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount;

  return (
    <AdminShell
      userName={user.name || user.email}
      storeName={store.name}
      storeId={store.id}
    >
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="ww-disp text-[24px] tracking-[-0.02em]">리뷰 관리</h1>
        <div className="flex items-center gap-5 text-[13px]">
          <Stat
            label="총 리뷰"
            value={`${totalCount}건`}
          />
          <Stat
            label="평균 평점"
            value={totalCount > 0 ? avgRating.toFixed(1) : "—"}
            highlight
          />
          <Stat
            label="답글"
            value={`${repliedCount} / ${totalCount}`}
          />
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white border border-fog rounded-[20px] py-16 text-center text-slate text-[14px]">
          아직 등록된 리뷰가 없어요. 고객이 예약 완료 후 리뷰를 남기면 여기에
          표시됩니다.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((r) => {
            const photos = Array.isArray(r.photos)
              ? (r.photos as unknown[]).filter(
                  (u): u is string => typeof u === "string",
                )
              : [];
            return (
              <article
                key={r.id}
                className="bg-white border border-fog rounded-[20px] p-6"
              >
                {/* 헤더: 별점 + 작성자 + 메타 */}
                <header className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Stars rating={r.rating} />
                      <span className="ww-num font-extrabold text-[15px]">
                        {r.rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="text-[12px] text-slate">
                      {r.user.name || r.user.email || "고객"}
                      {" · "}
                      <span className="ww-num">
                        {format(r.createdAt, "yyyy-MM-dd", { locale: ko })}
                      </span>
                      {r.reservation?.product?.title && (
                        <>
                          {" · "}
                          <span className="text-graphite font-bold">
                            {r.reservation.product.title}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {r.reply ? (
                    <span className="text-[10px] font-bold bg-success/10 text-success px-2 py-[3px] rounded-full">
                      답글 완료
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-warning/10 text-warning px-2 py-[3px] rounded-full">
                      답글 대기
                    </span>
                  )}
                </header>

                {/* 본문 */}
                {r.body && (
                  <div className="text-[14px] leading-[1.7] text-graphite whitespace-pre-wrap mb-3">
                    {r.body}
                  </div>
                )}

                {/* 사진 */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                    {photos.map((src, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-[8px] overflow-hidden bg-cloud border border-fog"
                      >
                        <Image
                          src={src}
                          alt={`리뷰 사진 ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 33vw, 200px"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 답글 입력/표시 */}
                <ReviewReplyForm
                  reviewId={r.id}
                  initialReply={r.reply}
                  saveAction={saveReply}
                  deleteAction={deleteReply}
                />
              </article>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-[11px] text-slate">{label}</span>
      <span
        className={`ww-num font-extrabold ${
          highlight ? "text-[18px]" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="inline-flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={n <= rating ? "#FFB400" : "#E5E5EA"}
        >
          <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8l-5.8 3.1 1.1-6.5L2.6 9.8l6.5-.9L12 3z" />
        </svg>
      ))}
    </div>
  );
}
