import { Suspense } from "react";
import { LoginForm } from "./LoginForm";
import { WWLogo } from "@/components/brand/Logo";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-app min-h-screen bg-white flex flex-col">
      <div className="px-5 pt-12 flex-1 flex flex-col">
        <div className="mt-10">
          <WWLogo size={20} />
        </div>
        <Suspense fallback={<div className="mt-20 text-slate text-center">불러오는 중…</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
