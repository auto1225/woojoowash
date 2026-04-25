"use client";

import { useState, useTransition } from "react";
import { updateInquiry } from "./actions";

type Inquiry = {
  id: string;
  storeName: string;
  contactName: string;
  phone: string;
  address: string | null;
  message: string | null;
  status: "NEW" | "CONTACTED" | "APPROVED" | "REJECTED";
  memo: string | null;
  createdAtLabel: string;
};

export function InquiryRow({
  inquiry,
  statusLabel,
}: {
  inquiry: Inquiry;
  statusLabel: Record<string, string>;
}) {
  const [status, setStatus] = useState(inquiry.status);
  const [memo, setMemo] = useState(inquiry.memo ?? "");
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(false);
    startTransition(async () => {
      await updateInquiry(inquiry.id, status, memo);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  }

  return (
    <div className="bg-white border border-fog rounded-[20px] p-6 grid gap-4 md:grid-cols-[1fr_1fr] lg:grid-cols-[1.3fr_1fr]">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-[11px] font-bold px-2 py-[3px] rounded-full ${
              status === "NEW"
                ? "bg-brand-bg text-brand-deep"
                : status === "CONTACTED"
                  ? "bg-warning/10 text-warning"
                  : status === "APPROVED"
                    ? "bg-success/10 text-success"
                    : "bg-fog text-slate"
            }`}
          >
            {statusLabel[status]}
          </span>
          <span className="text-[11px] text-slate ww-num">
            {inquiry.createdAtLabel}
          </span>
        </div>
        <div className="text-[18px] font-extrabold tracking-[-0.3px]">
          {inquiry.storeName}
        </div>
        <div className="text-[13px] mt-1">
          {inquiry.contactName} ·{" "}
          <span className="ww-num">{inquiry.phone}</span>
        </div>
        {inquiry.address && (
          <div className="text-[12px] text-slate mt-1">{inquiry.address}</div>
        )}
        {inquiry.message && (
          <div className="text-[13px] text-graphite leading-[1.7] mt-3 whitespace-pre-wrap">
            {inquiry.message}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <div>
          <div className="text-[12px] font-bold mb-[6px]">처리 상태</div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="w-full h-10 px-3 bg-paper border border-fog rounded-[10px] text-[13px]"
          >
            <option value="NEW">신규</option>
            <option value="CONTACTED">상담중</option>
            <option value="APPROVED">승인</option>
            <option value="REJECTED">반려</option>
          </select>
        </div>
        <div>
          <div className="text-[12px] font-bold mb-[6px]">내부 메모</div>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={3}
            placeholder="담당자·진행 내용 등을 기록하세요"
            className="w-full p-3 bg-paper border border-fog rounded-[10px] text-[13px] resize-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="h-10 px-5 rounded-full btn-brand text-[13px] disabled:opacity-50"
          >
            {pending ? "저장 중…" : "저장"}
          </button>
          {saved && (
            <span className="text-[12px] text-success font-semibold">
              저장됨
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
