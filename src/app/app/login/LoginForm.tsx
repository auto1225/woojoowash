"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

type Mode = "signin" | "signup";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/app";
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name: name || null }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          setError(j.error ?? "가입에 실패했어요.");
          return;
        }
      }
      const r = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (r?.error) {
        setError("이메일 또는 비밀번호가 올바르지 않아요.");
        return;
      }
      router.replace(callbackUrl);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mb-6">
        <div className="ww-disp text-[32px] leading-[1.15] tracking-[-0.03em] mb-2">
          세차의 모든 순간,
          <br />
          우주워시로.
        </div>
        <div className="text-slate text-[14px]">
          {mode === "signin"
            ? "로그인하고 예약을 시작하세요"
            : "회원가입하고 첫 예약 3,000원 쿠폰 받기"}
        </div>
      </div>

      <div className="flex gap-[6px] mb-5 p-[4px] bg-cloud rounded-full">
        {(["signin", "signup"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={`flex-1 h-11 rounded-full text-[14px] font-bold transition ${
              mode === m ? "bg-white text-ink shadow-ww-btn" : "text-slate"
            }`}
          >
            {m === "signin" ? "로그인" : "회원가입"}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        {mode === "signup" && (
          <input
            type="text"
            placeholder="이름 (선택)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-14 px-4 bg-cloud rounded-[14px] text-[15px] outline-none focus:ring-2 focus:ring-ink/10"
          />
        )}
        <input
          type="email"
          required
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="h-14 px-4 bg-cloud rounded-[14px] text-[15px] outline-none focus:ring-2 focus:ring-ink/10"
        />
        <input
          type="password"
          required
          placeholder={mode === "signup" ? "비밀번호 (8자 이상)" : "비밀번호"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={
            mode === "signup" ? "new-password" : "current-password"
          }
          className="h-14 px-4 bg-cloud rounded-[14px] text-[15px] outline-none focus:ring-2 focus:ring-ink/10"
        />

        {error && (
          <div className="text-[13px] text-danger bg-danger/5 border border-danger/20 rounded-[12px] px-4 py-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-14 rounded-[14px] bg-ink text-white font-bold text-[16px] mt-2 disabled:opacity-50"
        >
          {loading
            ? "잠시만요…"
            : mode === "signin"
              ? "로그인"
              : "가입하고 시작하기"}
        </button>
      </form>

      {mode === "signin" && (
        <div className="text-center mt-3 text-[12px] text-slate">
          데모 계정: <span className="ww-num">demo@woojoowash.kr / demo1234</span>
        </div>
      )}

      <div className="flex items-center gap-3 my-7">
        <div className="flex-1 h-px bg-fog" />
        <div className="text-[11px] text-slate">소셜 로그인은 곧 추가돼요</div>
        <div className="flex-1 h-px bg-fog" />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-8 opacity-50 pointer-events-none">
        <Social label="카카오" bg="#FEE500" fg="#1A1A1A" />
        <Social label="Apple" bg="#000" fg="#fff" />
        <Social label="Google" bg="#fff" fg="#000" border />
      </div>

      <div className="text-center mb-12">
        <Link href="/app" className="text-[13px] text-slate font-semibold underline">
          로그인 없이 둘러보기
        </Link>
      </div>
    </>
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
