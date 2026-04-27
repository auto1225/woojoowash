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

      <div className="grid grid-cols-4 gap-2 mb-8 opacity-50 pointer-events-none">
        <SocialIcon kind="naver" />
        <SocialIcon kind="kakao" />
        <SocialIcon kind="google" />
        <SocialIcon kind="apple" />
      </div>

      <div className="text-center mb-12">
        <Link href="/app" className="text-[13px] text-slate font-semibold underline">
          로그인 없이 둘러보기
        </Link>
      </div>
    </>
  );
}

type SocialKind = "naver" | "kakao" | "google" | "apple";

function SocialIcon({ kind }: { kind: SocialKind }) {
  const meta: Record<
    SocialKind,
    { bg: string; border?: boolean; aria: string }
  > = {
    naver: { bg: "#03C75A", aria: "네이버 로그인" },
    kakao: { bg: "#FEE500", aria: "카카오 로그인" },
    google: { bg: "#fff", border: true, aria: "Google 로그인" },
    apple: { bg: "#000", aria: "Apple 로그인" },
  };
  const m = meta[kind];
  return (
    <button
      type="button"
      aria-label={m.aria}
      className="h-12 rounded-[14px] flex items-center justify-center"
      style={{
        background: m.bg,
        border: m.border ? "1px solid var(--ww-fog)" : undefined,
      }}
    >
      {kind === "naver" && <NaverGlyph />}
      {kind === "kakao" && <KakaoGlyph />}
      {kind === "google" && <GoogleGlyph />}
      {kind === "apple" && <AppleGlyph />}
    </button>
  );
}

/* ── 브랜드 글리프 ── */
function NaverGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
      <path d="M16.273 12.845L7.376 0H0v24h7.726V11.155L16.624 24H24V0h-7.727z" />
    </svg>
  );
}
function KakaoGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#1A1A1A">
      <path d="M12 3C6.48 3 2 6.7 2 11.16c0 2.86 1.86 5.36 4.66 6.79l-1.18 4.3c-.1.36.3.64.62.45L11.4 19.5c.2.02.4.03.6.03 5.52 0 10-3.7 10-8.16S17.52 3 12 3z" />
    </svg>
  );
}
function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M21.6 12.227c0-.709-.064-1.39-.182-2.045H12v3.868h5.382a4.6 4.6 0 0 1-1.995 3.018v2.51h3.232c1.891-1.742 2.981-4.305 2.981-7.351z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.964-.895 6.619-2.422l-3.232-2.51c-.895.6-2.04.955-3.387.955-2.605 0-4.81-1.76-5.595-4.123H3.064v2.59A9.997 9.997 0 0 0 12 22z"
      />
      <path
        fill="#FBBC05"
        d="M6.405 13.9a6 6 0 0 1-.314-1.9c0-.66.114-1.3.314-1.9V7.51H3.064A10 10 0 0 0 2 12c0 1.614.386 3.14 1.064 4.49l3.34-2.59z"
      />
      <path
        fill="#EA4335"
        d="M12 5.977c1.469 0 2.787.505 3.823 1.495l2.868-2.868C16.96 2.99 14.696 2 12 2A9.997 9.997 0 0 0 3.064 7.51l3.34 2.59C7.19 7.736 9.395 5.977 12 5.977z"
      />
    </svg>
  );
}
function AppleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
      <path d="M17.05 12.04c-.03-2.92 2.39-4.32 2.5-4.39-1.36-1.99-3.48-2.26-4.24-2.29-1.8-.18-3.52 1.06-4.43 1.06-.93 0-2.33-1.04-3.83-1.01-1.97.03-3.79 1.15-4.81 2.91-2.05 3.55-.52 8.8 1.48 11.69.98 1.41 2.14 3 3.66 2.94 1.47-.06 2.02-.95 3.79-.95 1.77 0 2.27.95 3.81.92 1.58-.03 2.58-1.43 3.55-2.85 1.12-1.63 1.58-3.21 1.61-3.29-.04-.02-3.09-1.18-3.12-4.74zM14.13 3.79c.81-.99 1.36-2.36 1.21-3.73-1.17.05-2.59.78-3.43 1.76-.75.87-1.41 2.27-1.23 3.61 1.31.1 2.65-.66 3.45-1.64z" />
    </svg>
  );
}
