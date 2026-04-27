"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const TIMEOUT_MS = 30 * 60 * 1000; // 30 분
const ACTIVITY_EVENTS = [
  "click",
  "keydown",
  "scroll",
  "touchstart",
  "mousemove",
] as const;

/**
 * 로그인된 상태에서 30분간 활동이 없으면:
 *   1) /api/auth/refresh 시도 (refresh token cookie 가 살아있으면 silent 갱신)
 *   2) 실패하면 토스트 + signOut + /app/login?callbackUrl=현재경로
 */
export function InactivityTracker() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [showToast, setShowToast] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || !session) return;

    const reset = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(handleTimeout, TIMEOUT_MS);
    };

    async function handleTimeout() {
      // 1) silent refresh 시도
      try {
        const r = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "same-origin",
        });
        if (r.ok) {
          // 세션 갱신 성공 — 그대로 유지하고 타이머 재시작
          reset();
          return;
        }
      } catch {
        // 네트워크 오류 — 로그아웃 처리
      }
      // 2) 실패 → 로그아웃 + 안내 토스트
      const callback = encodeURIComponent(pathname || "/app");
      setShowToast(
        "30분 동안 활동이 없어 자동 로그아웃됐어요. 다시 로그인해 주세요.",
      );
      await signOut({ redirect: false });
      // 토스트 잠깐 보여준 뒤 로그인 페이지로
      setTimeout(() => {
        router.push(`/app/login?callbackUrl=${callback}`);
      }, 1500);
    }

    // 활동 이벤트 등록
    const opts: AddEventListenerOptions = { passive: true, capture: true };
    for (const ev of ACTIVITY_EVENTS) {
      window.addEventListener(ev, reset, opts);
    }
    reset(); // 첫 시작

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      for (const ev of ACTIVITY_EVENTS) {
        window.removeEventListener(ev, reset, opts);
      }
    };
  }, [status, session, router, pathname]);

  if (!showToast) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 -translate-x-1/2 bottom-8 z-[1000] pointer-events-none"
    >
      <div className="pointer-events-auto px-5 py-3 rounded-full bg-ink text-white text-[13px] font-bold shadow-[0_12px_36px_rgba(15,124,114,0.25)] ww-fade-up max-w-[calc(100vw-32px)] text-center">
        {showToast}
      </div>
    </div>
  );
}
