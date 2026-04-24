"use client";

import { useState } from "react";

export function FaqRow({
  faq,
  updateAction,
  deleteAction,
}: {
  faq: {
    id: string;
    category: string | null;
    question: string;
    answer: string;
    active: boolean;
  };
  updateAction: (fd: FormData) => void | Promise<void>;
  deleteAction: () => void | Promise<void>;
}) {
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return (
      <div className="bg-white border border-fog rounded-[16px] p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {faq.category && (
                <span className="text-[10px] font-bold bg-cloud text-graphite px-2 py-[3px] rounded-full">
                  {faq.category}
                </span>
              )}
              {!faq.active && (
                <span className="text-[10px] font-bold bg-ash/20 text-slate px-2 py-[3px] rounded-full">
                  비활성
                </span>
              )}
            </div>
            <div className="text-[15px] font-bold mb-2">{faq.question}</div>
            <div className="text-[13px] text-graphite leading-[1.7] whitespace-pre-wrap">
              {faq.answer}
            </div>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-[12px] font-semibold text-accent hover:underline"
            >
              수정
            </button>
            <form action={deleteAction}>
              <button
                type="submit"
                className="text-[12px] font-semibold text-danger hover:underline"
              >
                삭제
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      action={updateAction}
      onSubmit={() => setEditing(false)}
      className="bg-white border border-accent rounded-[16px] p-5 grid gap-3"
    >
      <div className="grid md:grid-cols-[160px_1fr] gap-3">
        <input
          type="text"
          name="category"
          defaultValue={faq.category ?? ""}
          placeholder="카테고리"
          className="h-11 px-3 bg-paper border border-fog rounded-[10px] text-[14px]"
        />
        <input
          type="text"
          name="question"
          defaultValue={faq.question}
          required
          className="h-11 px-3 bg-paper border border-fog rounded-[10px] text-[14px] font-bold"
        />
      </div>
      <textarea
        name="answer"
        defaultValue={faq.answer}
        required
        rows={4}
        className="p-3 bg-paper border border-fog rounded-[10px] text-[14px] resize-y"
      />
      <label className="flex items-center gap-2 text-[13px]">
        <input
          type="checkbox"
          name="active"
          defaultChecked={faq.active}
          className="w-4 h-4 accent-accent"
        />
        활성 (홈페이지·고객센터 노출)
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          className="h-10 px-5 rounded-full bg-ink text-white font-bold text-[13px]"
        >
          저장
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="h-10 px-5 rounded-full border border-fog text-slate font-semibold text-[13px]"
        >
          취소
        </button>
      </div>
    </form>
  );
}
