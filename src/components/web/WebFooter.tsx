import Link from "next/link";
import { WWLogo } from "@/components/brand/Logo";

const COLS = [
  {
    h: "서비스",
    l: [
      { t: "셀프세차", href: "/stores" },
      { t: "손세차", href: "/stores" },
      { t: "배달세차", href: "/stores" },
      { t: "출장세차", href: "/stores" },
    ],
  },
  {
    h: "우주워시",
    l: [
      { t: "회사 소개", href: "#" },
      { t: "제휴·입점", href: "/partners" },
      { t: "채용", href: "#" },
      { t: "뉴스룸", href: "#" },
    ],
  },
  {
    h: "고객지원",
    l: [
      { t: "자주 묻는 질문", href: "/support" },
      { t: "1:1 문의", href: "/support" },
      { t: "공지사항", href: "#" },
      { t: "이용약관", href: "#" },
    ],
  },
];

export function WebFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-site px-5 md:px-10 pt-20 pb-10">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          <div>
            <WWLogo size={22} dark />
            <p className="text-[13px] opacity-60 leading-[1.7] mt-5 max-w-[280px]">
              내 차를 빛나게 만드는
              <br />
              가장 쉬운 방법, 우주워시.
            </p>
            <div className="flex gap-2 mt-6">
              <span className="px-3 h-9 inline-flex items-center rounded-full border border-white/20 text-[12px] font-semibold">
                App Store
              </span>
              <span className="px-3 h-9 inline-flex items-center rounded-full border border-white/20 text-[12px] font-semibold">
                Google Play
              </span>
            </div>
          </div>
          {COLS.map((c) => (
            <div key={c.h}>
              <div className="text-[12px] font-bold mb-4 opacity-60 tracking-[0.08em]">
                {c.h.toUpperCase()}
              </div>
              <ul className="flex flex-col gap-[10px] text-[13px] opacity-90">
                {c.l.map((x) => (
                  <li key={x.t}>
                    <Link href={x.href} className="hover:opacity-100">
                      {x.t}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <div className="text-[12px] font-bold mb-4 opacity-60 tracking-[0.08em]">
              CONTACT
            </div>
            <div className="flex flex-col gap-[10px] text-[13px] opacity-90">
              <div className="ww-num font-bold text-[20px]">1588-0000</div>
              <div className="opacity-70">평일 10:00 — 19:00</div>
              <div className="opacity-70">help@woojoowash.kr</div>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[11px] opacity-50">
          <div className="leading-[1.7]">
            (주) 우주워시 · 대표 김우주 · 사업자 123-45-67890 · 통신판매 2026-서울강남-0000
            <br />
            서울 강남구 테헤란로 123, 12층
          </div>
          <div className="flex gap-4">
            <span>이용약관</span>
            <span className="font-semibold opacity-100">
              개인정보처리방침
            </span>
            <span>위치기반서비스</span>
          </div>
        </div>
        <div className="mt-6 text-[11px] opacity-35">
          © 2026 WoojooWash Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
