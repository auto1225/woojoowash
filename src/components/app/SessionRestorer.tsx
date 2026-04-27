"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * 앱 진입(또는 새로고침) 시 세션이 없으면 자동으로 /api/auth/refresh 시도.
 * - refresh token cookie 가 살아있으면 새 세션 발급 → 끊김 없이 로그인 유지
 * - 만료/폐기된 경우엔 401 → 그냥 비로그인 상태로 남음
 *
 * 한 번 시도해서 실패하면 같은 세션 동안 다시 시도하지 않음 (loop 방지).
 */
export function SessionRestorer() {
  const { status, update } = useSession();
  const router = useRouter();
  const triedRef = useRef(false);

  useEffect(() => {
    if (status !== "unauthenticated") return;
    if (triedRef.current) return;
    triedRef.current = true;
    (async () => {
      try {
        const r = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "same-origin",
        });
        if (r.ok) {
          // 세션 cookie 갱신됨 — useSession 강제 재페치
          await update();
          // 일부 서버 컴포넌트는 새로 fetch 해야 인증 상태가 보임
          router.refresh();
        }
      } catch {
        // 네트워크 오류는 무시 (UI 에 영향 없음)
      }
    })();
  }, [status, update, router]);

  return null;
}
