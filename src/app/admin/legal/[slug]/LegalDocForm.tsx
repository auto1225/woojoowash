"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";
import {
  INITIAL_SAVE_STATE,
  SaveButton,
  SaveToast,
  type SaveActionState,
} from "@/components/admin/SaveToast";

export function LegalDocForm({
  slug,
  action,
  defaults,
}: {
  slug: string;
  action: (
    prev: SaveActionState,
    formData: FormData,
  ) => Promise<SaveActionState>;
  defaults: { title: string; body: string };
}) {
  const [title, setTitle] = useState(defaults.title);
  const [body, setBody] = useState(defaults.body);
  const [saveState, formAction] = useFormState(action, INITIAL_SAVE_STATE);

  return (
    <form
      action={formAction}
      className="bg-white border border-fog rounded-[20px] p-8 max-w-[820px] flex flex-col gap-5"
    >
      <label className="block">
        <span className="text-[12px] font-bold mb-[6px] block">
          제목 <span className="text-danger">*</span>
        </span>
        <input
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink"
        />
      </label>

      <label className="block">
        <span className="text-[12px] font-bold mb-[6px] block">본문</span>
        <textarea
          name="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={24}
          placeholder="본문을 입력하세요. 줄바꿈은 그대로 앱에 표시됩니다."
          className="w-full p-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink resize-y leading-[1.7] font-mono"
        />
        <span className="text-[11px] text-slate mt-1 block">
          {body.length.toLocaleString("ko-KR")} 자
        </span>
      </label>

      <div className="flex items-center gap-3">
        <SaveButton />
        <Link
          href="/admin/legal"
          className="h-11 px-5 inline-flex items-center rounded-full border border-fog bg-white text-[13px] font-bold text-graphite hover:border-ink hover:text-ink transition"
        >
          목록으로
        </Link>
        <span className="ml-auto text-[11px] text-slate">
          앱 경로:{" "}
          <code className="bg-cloud px-1 rounded">
            {slug === "service-info" ? "/app/me/service-info" : "/app/me/legal"}
          </code>
        </span>
      </div>
      <SaveToast state={saveState} />
    </form>
  );
}
