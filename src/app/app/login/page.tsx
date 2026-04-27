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

      {/* 본문 컨텐츠 — 헤더와 타이틀 사이 여백 30px (이전 20px 의 1.5배) */}
      <div className="px-5 pt-[30px] flex-1 flex flex-col">
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
