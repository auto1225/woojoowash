import { AppBar } from "@/components/app/AppBar";
import { IconTicket } from "@/components/icons";

const COUPONS = [
  {
    title: "첫 예약 3,000원 할인",
    desc: "모든 서비스 · 최소 10,000원 이상",
    expires: "2026-05-30까지",
  },
  {
    title: "손세차 15% 할인",
    desc: "손세차 카테고리 전용",
    expires: "2026-05-15까지",
  },
];

export default function CouponsPage() {
  return (
    <div className="min-h-screen bg-paper pb-[100px]">
      <AppBar title="쿠폰함" />
      <section className="px-5 pt-5 flex flex-col gap-3">
        {COUPONS.map((c) => (
          <div
            key={c.title}
            className="bg-white rounded-[16px] border border-fog p-5 flex gap-4 items-center"
          >
            <div className="w-12 h-12 rounded-[12px] bg-ink text-white flex items-center justify-center">
              <IconTicket size={22} stroke={1.6} />
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-extrabold mb-[2px]">
                {c.title}
              </div>
              <div className="text-[12px] text-slate">{c.desc}</div>
              <div className="text-[11px] text-slate ww-num mt-1">
                {c.expires}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
