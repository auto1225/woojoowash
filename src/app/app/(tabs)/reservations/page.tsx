import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { MOCK_USER } from "@/lib/mock/user";

const STATUS_LABEL = {
  confirmed: "예약 확정",
  done: "완료",
  canceled: "취소됨",
};

export default function ReservationsPage() {
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
      <div className="px-5 flex flex-col gap-3">
        {MOCK_USER.reservations.map((r) => (
          <Link key={r.id} href={`/app/booking/${r.id}/confirmed`}>
            <Card className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-[11px] text-slate font-medium">
                    {STATUS_LABEL[r.status]}
                  </div>
                  <div className="text-[16px] font-extrabold mt-[2px] tracking-[-0.3px]">
                    {r.storeName}
                  </div>
                </div>
                <div className="text-[11px] text-slate">보기</div>
              </div>
              <div className="text-[13px] text-graphite">{r.productName}</div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-fog">
                <div className="text-[12px] text-slate ww-num">
                  {r.date} · {r.time} · {r.durationMin}분
                </div>
                <div className="text-[14px] font-extrabold ww-num">
                  {r.price.toLocaleString("ko-KR")}원
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
