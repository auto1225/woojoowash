"use client";

import { useEffect, useState } from "react";
import { IconPhone } from "@/components/icons";

export function PhoneCallButton({
  storeName,
  phone,
}: {
  storeName: string;
  phone: string;
}) {
  const [open, setOpen] = useState(false);

  // ESC 닫기 + body scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const telHref = `tel:${phone.replace(/[^0-9+]/g, "")}`;

  function confirmCall() {
    setOpen(false);
    // 전화앱으로 연결
    window.location.href = telHref;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-[12px] text-slate ww-num underline underline-offset-[3px] decoration-from-font hover:text-ink active:text-ink transition"
        aria-label={`${storeName}에 전화 걸기`}
      >
        <IconPhone size={14} stroke={1.6} />
        <span>{phone}</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 ww-fade-up" />
          <div
            className="relative w-full max-w-app bg-white rounded-t-[24px] pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)] ww-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto w-10 h-1 rounded-full bg-fog mb-3" />
            <div className="px-5 pt-2 pb-5 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center mb-3 text-brand-deep">
                <IconPhone size={22} stroke={1.7} />
              </div>
              <div className="text-[16px] font-extrabold tracking-[-0.3px]">
                전화 연결
              </div>
              <div className="text-[13px] text-slate mt-1">{storeName}</div>
              <div className="text-[18px] font-extrabold ww-num mt-2">
                {phone}
              </div>
              <div className="text-[12px] text-slate mt-2">
                전화앱으로 연결할까요?
              </div>
            </div>
            <div className="px-5 pt-1 pb-1 flex gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 h-12 rounded-full bg-cloud text-ink font-bold text-[14px]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirmCall}
                className="flex-1 h-12 rounded-full bg-ink text-white font-bold text-[14px] active:scale-[0.98] transition"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
