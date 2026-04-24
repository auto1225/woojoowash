"use client";

import { useState, useTransition } from "react";
import { IconArrow, IconCheck } from "@/components/icons";
import { submitPartnerInquiry } from "./actions";

export function PartnerInquiryForm() {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const r = await submitPartnerInquiry(fd);
      if (r?.error) {
        setError(r.error);
        return;
      }
      setDone(true);
      (e.target as HTMLFormElement).reset();
    });
  }

  if (done) {
    return (
      <div className="bg-paper rounded-[24px] p-10 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-success text-white flex items-center justify-center mb-5">
          <IconCheck size={24} stroke={3} />
        </div>
        <div className="ww-disp text-[22px] tracking-[-0.02em] mb-2">
          문의가 접수됐어요
        </div>
        <p className="text-slate text-[14px] leading-[1.7] mb-6">
          영업일 기준 1일 이내에 담당자가 연락드릴게요.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="h-11 px-5 rounded-full bg-ink text-white text-[13px] font-bold"
        >
          다시 문의하기
        </button>
      </div>
    );
  }

  return (
    <div className="bg-paper rounded-[24px] p-8 md:p-10">
      <div className="text-[12px] font-bold text-accent tracking-[0.15em] mb-2">
        CONTACT
      </div>
      <h3 className="ww-disp text-[24px] md:text-[30px] tracking-[-0.02em] mb-2">
        입점 문의하기
      </h3>
      <p className="text-slate text-[14px] mb-8">
        영업일 기준 1일 이내에 담당자가 연락드려요.
      </p>
      <form onSubmit={onSubmit} className="grid gap-4">
        <Field
          label="상호 / 매장명"
          name="storeName"
          placeholder="예: 퍼펙트 카케어 강남점"
          required
        />
        <Field
          label="대표자 성함"
          name="contactName"
          placeholder="예: 김우주"
          required
        />
        <Field
          label="연락처"
          name="phone"
          type="tel"
          placeholder="010-0000-0000"
          required
        />
        <Field
          label="주소"
          name="address"
          placeholder="예: 서울 강남구 테헤란로 123"
        />
        <label className="block">
          <span className="text-[12px] font-bold mb-[6px] block">
            문의 내용
          </span>
          <textarea
            name="message"
            rows={4}
            placeholder="매장 규모, 제공 서비스, 궁금한 점 등 자유롭게 남겨주세요."
            className="w-full p-4 bg-white border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink transition resize-none"
          />
        </label>
        {error && (
          <div className="text-[13px] text-danger bg-danger/5 border border-danger/20 rounded-[10px] px-3 py-2">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={pending}
          className="h-14 rounded-full bg-ink text-white font-bold inline-flex items-center justify-center gap-2 hover:bg-accent-deep transition disabled:opacity-50"
        >
          {pending ? "제출 중…" : "문의 보내기"}{" "}
          <IconArrow size={16} stroke={2.5} />
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-bold mb-[6px] block">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full h-12 px-4 bg-white border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink transition"
      />
    </label>
  );
}
