"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function ReviewReplyForm({
  reviewId,
  initialReply,
  saveAction,
  deleteAction,
}: {
  reviewId: string;
  initialReply: string | null;
  saveAction: (reviewId: string, reply: string) => Promise<void>;
  deleteAction: (reviewId: string) => Promise<void>;
}) {
  const router = useRouter();
  const [reply, setReply] = useState<string>(initialReply ?? "");
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(
    null,
  );

  const isEdit = !!initialReply;

  function flash(kind: "ok" | "err", msg: string) {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 2500);
  }

  function onSave() {
    const t = reply.trim();
    if (!t) {
      flash("err", "답글 내용을 입력해주세요.");
      return;
    }
    startTransition(async () => {
      try {
        await saveAction(reviewId, t);
        router.refresh();
        flash("ok", isEdit ? "답글을 수정했어요" : "답글을 등록했어요");
      } catch (e) {
        flash(
          "err",
          e instanceof Error ? e.message : "저장 중 오류가 발생했어요.",
        );
      }
    });
  }

  function onDelete() {
    if (!window.confirm("답글을 삭제할까요?")) return;
    startTransition(async () => {
      try {
        await deleteAction(reviewId);
        setReply("");
        router.refresh();
        flash("ok", "답글을 삭제했어요");
      } catch (e) {
        flash(
          "err",
          e instanceof Error ? e.message : "삭제 중 오류가 발생했어요.",
        );
      }
    });
  }

  return (
    <div className="mt-3 rounded-[12px] bg-paper border border-fog p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-extrabold text-brand-deep">
          매장 답글
        </span>
        {isEdit && (
          <span className="text-[10px] text-slate">
            저장 시 기존 답글 위로 갱신돼요
          </span>
        )}
      </div>
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        rows={3}
        maxLength={500}
        placeholder="고객님의 리뷰에 진심을 담아 답글을 남겨주세요."
        className="w-full p-3 bg-white border border-fog rounded-[10px] text-[13px] outline-none focus:border-ink resize-none leading-[1.6]"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] text-slate ww-num">
          {reply.length} / 500
        </span>
        <div className="flex gap-2">
          {isEdit && (
            <button
              type="button"
              onClick={onDelete}
              disabled={pending}
              className="h-9 px-4 rounded-full border border-fog bg-white text-danger text-[12px] font-bold hover:bg-danger/5 hover:border-danger/30 transition disabled:opacity-50"
            >
              삭제
            </button>
          )}
          <button
            type="button"
            onClick={onSave}
            disabled={pending}
            className="h-9 px-5 rounded-full bg-ink text-white text-[12px] font-bold disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            {pending && (
              <span className="inline-block w-2.5 h-2.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            )}
            {pending ? "저장 중..." : isEdit ? "답글 수정" : "답글 등록"}
          </button>
        </div>
      </div>
      {toast && (
        <div
          role="status"
          className={`mt-2 text-[12px] font-bold ${
            toast.kind === "ok" ? "text-success" : "text-danger"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
