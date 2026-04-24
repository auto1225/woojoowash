import Image from "next/image";
import Link from "next/link";
import { IconArrow, IconCheck } from "@/components/icons";
import { IMG } from "@/lib/images";

const PLANS = [
  {
    name: "라이트",
    price: 9900,
    desc: "가볍게 시작하는 셀프세차 전용 패스",
    features: ["셀프세차 무제한 30% 할인", "월 1회 단품 쿠폰", "언제든 해지 가능"],
  },
  {
    name: "스탠다드",
    price: 19900,
    desc: "셀프·손세차를 두루 이용하는 분께",
    hot: true,
    features: [
      "셀프세차 무제한 40%",
      "손세차 월 2회 40%",
      "카페 제휴 쿠폰 월 1장",
      "우선 예약 슬롯",
    ],
  },
  {
    name: "프리미엄",
    price: 29900,
    desc: "차량 관리까지 우주워시에 전부 맡기고 싶다면",
    features: [
      "모든 서비스 50% 할인",
      "픽업·배달 무제한",
      "Before/After 월 1회 무료",
      "전용 컨시어지 채팅",
    ],
  },
];

export default function PassPage() {
  return (
    <>
      <section className="relative py-20 md:py-28 bg-paper overflow-hidden">
        <div className="absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full ww-gradient-blue opacity-20 blur-3xl" />
        <div className="mx-auto max-w-site px-5 md:px-10 relative">
          <div className="max-w-[640px]">
            <div className="text-[12px] font-bold text-accent tracking-[0.15em] mb-4">
              MEMBERSHIP
            </div>
            <h1 className="ww-disp text-[44px] md:text-[68px] tracking-[-0.03em] leading-[1.02]">
              매달 아끼는
              <br />
              <span className="text-accent">세차비 50%</span>
            </h1>
            <p className="text-slate text-[16px] leading-[1.7] mt-6 max-w-[480px]">
              첫 달 50% 할인으로 시작하세요. 언제든 중도 해지 가능, 남은
              기간은 정상 이용됩니다.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-site px-5 md:px-10">
          <div className="grid gap-5 md:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`relative rounded-[26px] p-8 md:p-10 ${
                  p.hot
                    ? "bg-ink text-white shadow-ww-ink"
                    : "bg-white text-ink border border-fog"
                }`}
              >
                {p.hot && (
                  <div className="absolute -top-3 left-8 inline-flex items-center gap-[6px] text-[11px] font-bold bg-accent text-white px-3 py-[6px] rounded-full">
                    가장 인기 있는 플랜
                  </div>
                )}
                <div className="text-[22px] font-extrabold mb-2 tracking-[-0.02em]">
                  {p.name}
                </div>
                <div
                  className={`text-[13px] mb-8 leading-[1.5] ${
                    p.hot ? "opacity-70" : "text-slate"
                  }`}
                >
                  {p.desc}
                </div>
                <div className="mb-8">
                  <span className="ww-disp text-[48px] tracking-[-0.03em] ww-num">
                    {p.price.toLocaleString("ko-KR")}원
                  </span>
                  <span
                    className={`text-[13px] ml-1 ${
                      p.hot ? "opacity-60" : "text-slate"
                    }`}
                  >
                    / 월
                  </span>
                </div>
                <ul className="flex flex-col gap-3 mb-10">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-[14px]"
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          p.hot
                            ? "bg-accent text-white"
                            : "bg-accent-soft text-accent-deep"
                        }`}
                      >
                        <IconCheck size={12} stroke={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/app/login"
                  className={`w-full inline-flex items-center justify-center gap-2 h-14 rounded-full font-bold text-[15px] ${
                    p.hot
                      ? "bg-white text-ink"
                      : "bg-ink text-white"
                  }`}
                >
                  가입하기 <IconArrow size={14} stroke={2.5} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-site px-5 md:px-10">
          <div className="relative rounded-[28px] overflow-hidden aspect-[16/7] min-h-[320px]">
            <Image
              src={IMG.member}
              alt="할인패스"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 ww-gradient-fade" />
            <div className="absolute bottom-10 left-10 right-10 text-white max-w-[520px]">
              <div className="text-[12px] font-bold text-accent-sky tracking-[0.15em] mb-3">
                FOR POWER USER
              </div>
              <div className="ww-disp text-[28px] md:text-[36px] tracking-[-0.02em] leading-[1.15]">
                한 달에 네 번만 이용해도,
                <br />
                패스값의 두 배 이상 절약돼요.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
