import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Card } from "@/components/ui/Card";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const STATUS_LABEL = {
  CONFIRMED: "예약 확정",
  DONE: "완료",
  CANCELED: "취소됨",
} as const;

export default async function ReservationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login?callbackUrl=/app/reservations");

  const reservations = await db.reservation.findMany({
    where: { userId: session.user.id },
    orderBy: { startAt: "desc" },
    include: {
      store: { select: { name: true } },
      product: { select: { title: true } },
      review: { select: { id: true, rating: true } },
    },
  });

  return (
    <>
      <div className="px-5 pt-4 pb-3">
        <div className="ww-disp text-[26px] tracking-[-0.02em]">예약 내역</div>
      </div>
      <div className="flex gap-2 px-5 mb-4">
        {["전체", "예약 확정", "완료", "취소"].map((t, i) => (
          <span
            key={t}
            className={`text-[13px] font-semibold px-4 py-[7px] rounded-full border ${
              i === 0 ? "bg-ink text-white border-ink" : "border-fog text-graphite"
            }`}
          >
            {t}
          </span>
        ))}
      </div>

      {reservations.length === 0 ? (
        <div className="px-5 pt-10 text-center">
          <div className="text-[14px] text-slate mb-4">
            아직 예약 내역이 없어요.
          </div>
          <Link
            href="/app/stores"
            className="inline-flex h-11 items-center px-5 rounded-full bg-ink text-white text-[13px] font-bold"
          >
            매장 둘러보기
          </Link>
        </div>
      ) : (
        <div className="px-5 flex flex-col gap-3">
          {reservations.map((r) => {
            const canReview = r.status === "DONE" && !r.review;
            return (
              <Card key={r.id} className="p-5">
                <Link href={`/app/booking/${r.id}/confirmed`} className="block">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-[11px] text-slate font-medium">
                        {STATUS_LABEL[r.status]}
                      </div>
                      <div className="text-[16px] font-extrabold mt-[2px] tracking-[-0.3px]">
                        {r.store.name}
                      </div>
                    </div>
                    <div className="text-[11px] text-slate">보기</div>
                  </div>
                  <div className="text-[13px] text-graphite">
                    {r.product.title}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-fog">
                    <div className="text-[12px] text-slate ww-num">
                      {format(r.startAt, "yyyy-MM-dd (EEE) HH:mm", {
                        locale: ko,
                      })}{" "}
                      · {r.durationMin}분
                    </div>
                    <div className="text-[14px] font-extrabold ww-num">
                      {r.price.toLocaleString("ko-KR")}원
                    </div>
                  </div>
                </Link>
                {(canReview || r.review) && (
                  <div className="mt-3 pt-3 border-t border-fog">
                    {canReview ? (
                      <Link
                        href={`/app/reservations/${r.id}/review`}
                        className="inline-flex h-10 items-center gap-2 px-4 rounded-full bg-ink text-white text-[12px] font-bold"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8l-5.8 3.1 1.1-6.5L2.6 9.8l6.5-.9L12 3z" />
                        </svg>
                        리뷰 작성하기
                      </Link>
                    ) : (
                      <div className="text-[12px] text-slate inline-flex items-center gap-1.5">
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="#FFB400"
                        >
                          <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8l-5.8 3.1 1.1-6.5L2.6 9.8l6.5-.9L12 3z" />
                        </svg>
                        리뷰 작성 완료 ({r.review?.rating}점)
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
