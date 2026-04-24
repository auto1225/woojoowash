import { AppBar } from "@/components/app/AppBar";
import { IconArrow } from "@/components/icons";

const PLANS = [
  { name: "라이트", price: 9900, desc: "셀프세차 30% 할인" },
  { name: "스탠다드", price: 19900, desc: "셀프·손세차 40% 할인", hot: true },
  { name: "프리미엄", price: 29900, desc: "모든 서비스 50% + 픽업 무료" },
];

export default function AppPassPage() {
  return (
    <div className="min-h-screen bg-paper pb-[100px]">
      <AppBar title="할인패스" />
      <section className="px-5 pt-6">
        <div className="ww-disp text-[26px] tracking-[-0.02em] mb-2">
          할인패스로
          <br />
          세차비 반값
        </div>
        <div className="text-[13px] text-slate mb-6">
          월 9,900원부터, 첫 달 50% 할인
        </div>
      </section>
      <section className="px-5 flex flex-col gap-3">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`rounded-[18px] px-6 py-5 ${
              p.hot
                ? "bg-ink text-white"
                : "bg-white border border-fog"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[16px] font-extrabold tracking-[-0.2px]">
                  {p.name}
                </div>
                <div
                  className={`text-[12px] mt-1 ${
                    p.hot ? "opacity-70" : "text-slate"
                  }`}
                >
                  {p.desc}
                </div>
              </div>
              <div className="ww-disp text-[22px] ww-num">
                {p.price.toLocaleString("ko-KR")}원
              </div>
            </div>
            <div
              className={`mt-4 inline-flex items-center gap-1 text-[12px] font-bold ${
                p.hot ? "text-white" : "text-accent"
              }`}
            >
              자세히 보기 <IconArrow size={12} stroke={2.5} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
