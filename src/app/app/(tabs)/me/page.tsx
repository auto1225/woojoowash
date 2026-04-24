import Link from "next/link";
import { IconCamera, IconCar, IconChev, IconHelp, IconInfo, IconMsg, IconSettings, IconShield, IconTicket } from "@/components/icons";
import { MOCK_USER } from "@/lib/mock/user";

const LINKS = [
  { I: IconCar, label: "내 차량", href: "/app/me/cars" },
  { I: IconTicket, label: "쿠폰함", href: "/app/me/coupons" },
  { I: IconCamera, label: "Before / After", href: "/app/me/before-after" },
  { I: IconMsg, label: "1:1 문의", href: "#" },
  { I: IconHelp, label: "자주 묻는 질문", href: "#" },
  { I: IconShield, label: "이용약관·개인정보처리방침", href: "#" },
  { I: IconInfo, label: "서비스 정보", href: "#" },
  { I: IconSettings, label: "설정", href: "#" },
];

export default function MePage() {
  return (
    <>
      <div className="px-5 pt-4 pb-6">
        <div className="ww-disp text-[26px] tracking-[-0.02em]">마이</div>
      </div>

      <section className="px-5 mb-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-cloud flex items-center justify-center text-[18px] font-extrabold">
            {MOCK_USER.name[0]}
          </div>
          <div className="flex-1">
            <div className="text-[18px] font-extrabold">{MOCK_USER.name}</div>
            <div className="text-[12px] text-slate ww-num">
              {MOCK_USER.phone}
            </div>
          </div>
          <Link href="#" className="text-[12px] text-slate">
            프로필 수정
          </Link>
        </div>
      </section>

      <section className="px-5 mb-6">
        <div className="grid grid-cols-3 bg-cloud rounded-[16px] overflow-hidden">
          {[
            { k: "2", l: "이용 완료" },
            { k: "1", l: "쿠폰" },
            { k: "0", l: "리뷰" },
          ].map((s, i) => (
            <div
              key={s.l}
              className={`py-5 text-center ${i !== 2 ? "border-r border-fog" : ""}`}
            >
              <div className="ww-disp text-[24px] ww-num">{s.k}</div>
              <div className="text-[11px] text-slate font-medium mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="h-3 bg-cloud" />

      <section className="flex flex-col">
        {LINKS.map((x) => (
          <Link
            key={x.label}
            href={x.href}
            className="flex items-center gap-[14px] px-5 py-4 bg-white"
          >
            <x.I size={22} stroke={1.6} />
            <div className="flex-1 text-[15px] font-medium">{x.label}</div>
            <IconChev size={18} stroke={1.8} className="text-ash" />
          </Link>
        ))}
      </section>
    </>
  );
}
