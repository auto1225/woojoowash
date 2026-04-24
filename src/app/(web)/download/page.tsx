import Image from "next/image";
import Link from "next/link";
import { IconArrow, IconCheck } from "@/components/icons";
import { IMG } from "@/lib/images";

const POINTS = [
  "첫 예약 3,000원 쿠폰 즉시 발급",
  "할인패스 첫 달 50% 할인",
  "카카오 3초 가입, 전화번호만 있으면 됩니다",
];

export default function DownloadPage() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-site px-5 md:px-10 grid gap-14 md:grid-cols-2 items-center">
        <div>
          <div className="text-[12px] font-bold text-accent tracking-[0.15em] mb-4">
            DOWNLOAD
          </div>
          <h1 className="ww-disp text-[44px] md:text-[64px] tracking-[-0.03em] leading-[1.02] mb-6">
            지금 앱을
            <br />
            다운로드하세요
          </h1>
          <p className="text-slate text-[16px] leading-[1.7] mb-8 max-w-[440px]">
            iOS · Android 모두 지원합니다. 웹앱으로도 바로 체험해 보실 수
            있어요.
          </p>

          <ul className="flex flex-col gap-3 mb-10">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-3 text-[14px]">
                <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center">
                  <IconCheck size={14} stroke={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            <span className="h-14 px-7 inline-flex items-center gap-3 rounded-full bg-ink text-white text-[14px] font-bold shadow-ww-ink">
              <svg width="18" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12-.99.362-2.02 1.01-2.8.73-.87 1.99-1.54 3.154-1.85zM19.8 17.6c-.47 1.04-.71 1.5-1.32 2.42-.85 1.28-2.05 2.87-3.54 2.88-1.32.01-1.66-.86-3.45-.85-1.79.01-2.17.87-3.49.86-1.49-.01-2.63-1.45-3.48-2.73C2.16 16.35 1.86 11.45 3.64 9.1 4.89 7.36 6.89 6.4 8.75 6.4c1.9 0 3.09.99 4.66.99 1.53 0 2.45-.99 4.65-.99 1.66 0 3.42.9 4.68 2.47-4.12 2.25-3.45 8.14-2.94 8.74z" />
              </svg>
              App Store 다운로드
            </span>
            <span className="h-14 px-7 inline-flex items-center gap-3 rounded-full border-[1.5px] border-ink text-ink text-[14px] font-bold">
              <svg width="18" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 20.5V3.5c0-.3.2-.6.5-.7L14 12 3.5 21.2c-.3-.1-.5-.4-.5-.7zM14.5 12.5l2.4 2.4-11 6.3 8.6-8.7zM16.9 9.6L14.5 12 5.9 3.3l11 6.3zM20.2 12.5c.5-.3.8-.8.8-1.3s-.3-1-.8-1.3l-2.6-1.5L15 11l2.6 2.6 2.6-1.1z" />
              </svg>
              Google Play
            </span>
            <Link
              href="/app"
              className="h-14 px-7 inline-flex items-center gap-2 rounded-full bg-accent text-white text-[14px] font-bold hover:bg-accent-deep transition"
            >
              웹앱 체험 <IconArrow size={14} stroke={2.5} />
            </Link>
          </div>
        </div>

        <div className="relative h-[520px] md:h-[620px]">
          <div className="absolute inset-x-10 top-0 bottom-0 rounded-[28px] overflow-hidden">
            <Image
              src={IMG.hero}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 ww-gradient-fade" />
          </div>
          <div className="absolute left-0 top-8 w-[240px] bg-white rounded-[20px] p-5 shadow-ww-pop">
            <div className="text-[10px] font-bold text-accent tracking-[0.1em]">
              BOOKING CONFIRMED
            </div>
            <div className="ww-disp text-[20px] mt-2 tracking-[-0.02em]">
              강남점 · 14:30
            </div>
            <div className="text-[12px] text-slate mt-1">
              기본 디테일링 · 60분
            </div>
          </div>
          <div className="absolute right-0 bottom-8 w-[260px] bg-ink text-white rounded-[20px] p-5 shadow-ww-ink">
            <div className="text-[10px] font-bold text-accent-sky tracking-[0.1em]">
              DISCOUNT PASS
            </div>
            <div className="ww-disp text-[20px] mt-2 tracking-[-0.02em]">
              스탠다드 · 첫 달 50%
            </div>
            <div className="text-[12px] opacity-70 mt-1">월 19,900원</div>
          </div>
        </div>
      </div>
    </section>
  );
}
