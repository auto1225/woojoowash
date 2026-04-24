import { Suspense } from "react";
import { WWLogo } from "@/components/brand/Logo";
import { AdminLoginForm } from "./AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-5">
      <div className="w-full max-w-[420px] bg-white rounded-[20px] border border-fog p-10">
        <div className="flex items-center gap-2 mb-8">
          <WWLogo size={18} compact />
          <span className="text-[11px] font-bold text-slate bg-cloud rounded-full px-2 py-[2px]">
            CMS
          </span>
        </div>
        <div className="ww-disp text-[28px] tracking-[-0.02em] mb-2">
          매장 운영자 로그인
        </div>
        <div className="text-[13px] text-slate mb-8">
          우주워시 파트너 전용 관리 콘솔입니다.
        </div>
        <Suspense fallback={<div className="text-slate text-sm">불러오는 중…</div>}>
          <AdminLoginForm />
        </Suspense>
        <div className="text-[11px] text-slate mt-6 leading-[1.7]">
          데모 운영자: <span className="ww-num">owner@woojoowash.kr / owner1234</span>
        </div>
      </div>
    </div>
  );
}
