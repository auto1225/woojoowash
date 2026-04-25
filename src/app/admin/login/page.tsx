import { Suspense } from "react";
import { WWLogo } from "@/components/brand/Logo";
import { AdminConsoleLoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-5 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #6FE7DD 0%, #B3F0FF 50%, #E6FBF8 100%)",
      }}
    >
      {/* 배경 데코 — 큰 원형 블러 */}
      <div className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full bg-white/30 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full bg-brand-sky/40 blur-3xl" />

      <div className="relative w-full max-w-[420px] bg-white rounded-[24px] p-10 shadow-[0_24px_60px_rgba(15,124,114,0.18)]">
        <div className="flex items-center gap-2 mb-8">
          <WWLogo size={18} compact />
          <span
            className="text-[11px] font-extrabold text-ink rounded-full px-[10px] py-[3px] tracking-wide"
            style={{ background: "var(--ww-brand-grad)" }}
          >
            ADMIN
          </span>
        </div>
        <div className="ww-disp text-[28px] tracking-[-0.02em] mb-2">
          서비스 관리자 로그인
        </div>
        <div className="text-[13px] text-slate mb-8">
          우주워시 운영팀 전용 백오피스입니다.
        </div>
        <Suspense
          fallback={<div className="text-slate text-sm">불러오는 중…</div>}
        >
          <AdminConsoleLoginForm />
        </Suspense>
        <div className="text-[11px] text-slate mt-6 leading-[1.7]">
          데모 관리자:{" "}
          <span className="ww-num">admin@woojoowash.kr / admin1234</span>
        </div>
      </div>
    </div>
  );
}
