import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AppBar } from "@/components/app/AppBar";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function MyReviewsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/app/login?callbackUrl=/app/me/reviews");
  }

  const reviews = await db.review.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      store: { select: { id: true, name: true } },
      reservation: {
        select: { product: { select: { title: true } } },
      },
    },
  });

  return (
    <div className="pb-12">
      <AppBar title="내 리뷰" showBack />

      <div className="px-5 pt-5 pb-3 flex items-baseline justify-between">
        <div className="text-[16px] font-extrabold tracking-[-0.3px]">
          작성한 리뷰
        </div>
        <div className="text-[12px] text-slate ww-num">
          총 <span className="text-ink font-bold">{reviews.length}</span>건
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="px-5 pt-10 text-center">
          <div className="text-[14px] text-slate mb-4">
            아직 작성한 리뷰가 없어요. 이용 완료된 예약에 리뷰를 남겨보세요.
          </div>
          <Link
            href="/app/reservations"
            className="inline-flex h-11 items-center px-5 rounded-full bg-ink text-white text-[13px] font-bold"
          >
            예약 내역 보기
          </Link>
        </div>
      ) : (
        <div className="px-5 flex flex-col gap-3">
          {reviews.map((r) => {
            const photos = Array.isArray(r.photos)
              ? (r.photos as unknown[]).filter(
                  (u): u is string => typeof u === "string",
                )
              : [];
            return (
              <article
                key={r.id}
                className="rounded-[16px] border border-fog bg-white p-4"
              >
                <header className="flex items-center justify-between mb-2">
                  <Link
                    href={`/app/stores/${r.store.id}`}
                    className="text-[12px] text-accent font-bold hover:underline"
                  >
                    {r.store.name}
                  </Link>
                  <span className="text-[11px] text-slate ww-num">
                    {format(r.createdAt, "yyyy-MM-dd", { locale: ko })}
                  </span>
                </header>
                <div className="flex items-center gap-2 mb-2">
                  <Stars rating={r.rating} />
                  <span className="ww-num font-extrabold text-[14px]">
                    {r.rating.toFixed(1)}
                  </span>
                  {r.reservation?.product?.title && (
                    <span className="text-[11px] text-slate truncate">
                      · {r.reservation.product.title}
                    </span>
                  )}
                </div>
                {r.body && (
                  <div className="text-[13px] leading-[1.7] text-graphite whitespace-pre-wrap">
                    {r.body}
                  </div>
                )}
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-1 mt-3">
                    {photos.map((u, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-[8px] overflow-hidden bg-cloud"
                      >
                        <Image
                          src={u}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 480px) 33vw, 160px"
                        />
                      </div>
                    ))}
                  </div>
                )}
                {r.reply && (
                  <div className="mt-3 rounded-[10px] bg-paper border border-fog p-3">
                    <div className="text-[10px] font-bold text-brand-deep tracking-[0.05em] mb-1">
                      매장 답글
                      {r.repliedAt && (
                        <span className="ml-2 text-slate font-medium ww-num">
                          {format(r.repliedAt, "yyyy-MM-dd", { locale: ko })}
                        </span>
                      )}
                    </div>
                    <div className="text-[12px] leading-[1.6] text-graphite whitespace-pre-wrap">
                      {r.reply}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={n <= rating ? "#FFB400" : "#E5E5EA"}
        >
          <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8l-5.8 3.1 1.1-6.5L2.6 9.8l6.5-.9L12 3z" />
        </svg>
      ))}
    </span>
  );
}
