"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

export function AdminConsoleLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
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
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <label className="block">
        <span className="text-[12px] font-bold mb-[6px] block">이메일</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="w-full h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-brand-deep transition"
        />
      </label>
      <label className="block">
        <span className="text-[12px] font-bold mb-[6px] block">비밀번호</span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-brand-deep transition"
        />
      </label>
      {error && (
        <div className="text-[12px] text-danger bg-danger/5 border border-danger/20 rounded-[10px] px-3 py-2">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="h-12 rounded-full text-ink font-extrabold text-[14px] mt-2 disabled:opacity-50 transition hover:brightness-95 shadow-[0_8px_24px_rgba(15,124,114,0.25)]"
        style={{ background: "var(--ww-brand-grad)" }}
      >
        {loading ? "로그인 중…" : "로그인"}
      </button>
    </form>
  );
}
