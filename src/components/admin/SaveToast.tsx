"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { INITIAL_SAVE_STATE, type SaveActionState } from "./save-action";

// 클라이언트 컴포넌트 사용처 편의를 위해 type/상수만 그대로 re-export.
// withSaveResult 는 서버에서만 호출하므로 서버 액션은 ./save-action 에서 직접 import.
export { INITIAL_SAVE_STATE };
export type { SaveActionState };

/**
 * 액션 결과 상태를 받아 토스트를 띄움 (성공/실패 자동 분기).
 * useFormState 의 state 를 그대로 넘기면 됨.
 */
export function SaveToast({
  state,
  successMessage,
}: {
  state: SaveActionState;
  successMessage?: string;
}) {
  const [toast, setToast] = useState<
    | { kind: "ok" | "err"; msg: string }
    | null
  >(null);

  useEffect(() => {
    if (state.ts === 0) return; // 초기 상태
    if (state.ok) {
      setToast({
        kind: "ok",
        msg: successMessage ?? "저장이 완료되었습니다.",
      });
    } else {
      setToast({
        kind: "err",
        msg: state.error ?? "저장에 실패했어요.",
      });
    }
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [state.ts, state.ok, state.error, successMessage]);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 -translate-x-1/2 bottom-8 z-[100] pointer-events-none"
    >
      <div
        className={`pointer-events-auto px-5 py-3 rounded-full shadow-[0_12px_36px_rgba(15,124,114,0.25)] flex items-center gap-2 text-[13px] font-bold ww-fade-up ${
          toast.kind === "ok" ? "bg-ink text-white" : "bg-danger text-white"
        }`}
      >
        <span
          className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
            toast.kind === "ok"
              ? "bg-brand text-ink"
              : "bg-white/20 text-white"
          }`}
        >
          {toast.kind === "ok" ? (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12l5 5L20 7" />
            </svg>
          ) : (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          )}
        </span>
        <span>{toast.msg}</span>
      </div>
    </div>
  );
}

/**
 * 폼 제출 중 자동으로 disable + 스피너가 붙는 저장 버튼.
 * `<form action={formAction}>` 내부에서만 사용.
 */
export function SaveButton({
  label = "저장",
  pendingLabel = "저장 중...",
  className,
}: {
  label?: string;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={
        className ??
        "self-start h-11 px-6 rounded-full bg-ink text-white font-bold text-[14px] disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
      }
    >
      {pending && (
        <span className="inline-block w-3 h-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
      )}
      {pending ? pendingLabel : label}
    </button>
  );
}
