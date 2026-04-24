import Link from "next/link";
import { WWLogo } from "@/components/brand/Logo";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-app min-h-screen bg-white flex flex-col">
      <div className="px-5 pt-12 flex-1 flex flex-col">
        <div className="mt-10">
          <WWLogo size={20} />
        </div>

        <div className="mt-auto mb-10">
          <div className="ww-disp text-[32px] leading-[1.15] tracking-[-0.03em] mb-2">
            세차의 모든 순간,
            <br />
            우주워시로.
          </div>
          <div className="text-slate text-[14px]">
            카카오 3초 가입하고 첫 결제 3,000원 쿠폰 받기
          </div>
        </div>

        <Link
          href="/app"
          className="h-14 rounded-[14px] flex items-center justify-center gap-2 bg-[#FEE500] text-[#1A1A1A] font-bold text-[16px] mb-3"
        >
          <svg width="22" height="20" viewBox="0 0 24 22" fill="#1A1A1A">
            <path d="M12 2C6.48 2 2 5.5 2 9.8c0 2.8 1.9 5.2 4.8 6.6l-1 3.3c-.1.4.3.7.6.5L10.3 18c.5 0 1.1.1 1.7.1 5.52 0 10-3.5 10-7.8C22 5.5 17.52 2 12 2z" />
          </svg>
          카카오로 3초 시작하기
        </Link>

        <div className="grid grid-cols-3 gap-2 mb-8">
          <Social label="네이버" bg="#03C75A" fg="#fff" />
          <Social label="Apple" bg="#000" fg="#fff" />
          <Social label="Google" bg="#fff" fg="#000" border />
        </div>

        <div className="text-center mb-12">
          <Link href="/app" className="text-[13px] text-slate font-semibold underline">
            로그인 없이 둘러보기
          </Link>
        </div>
      </div>
    </div>
  );
}

function Social({
  label,
  bg,
  fg,
  border,
}: {
  label: string;
  bg: string;
  fg: string;
  border?: boolean;
}) {
  return (
    <div
      className="h-12 rounded-[14px] flex items-center justify-center text-[13px] font-bold"
      style={{
        background: bg,
        color: fg,
        border: border ? "1px solid var(--ww-fog)" : undefined,
      }}
    >
      {label}
    </div>
  );
}
