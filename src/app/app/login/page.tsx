import { Suspense } from "react";
import { LoginForm } from "./LoginForm";
import { WWLogo } from "@/components/brand/Logo";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-app min-h-screen bg-white flex flex-col">
      {/* 상단 타이틀 — 로고 + 우주워시 */}
      <header className="sticky top-0 z-30 bg-white border-b border-fog h-[52px] flex items-center px-4">
        <WWLogo size={20} />
      </header>

      {/* 본문 컨텐츠 — 위로 붙이기 위해 pt 만 살짝 */}
      <div className="px-5 pt-5 flex-1 flex flex-col">
        <Suspense
          fallback={
            <div className="mt-12 text-slate text-center">불러오는 중…</div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
