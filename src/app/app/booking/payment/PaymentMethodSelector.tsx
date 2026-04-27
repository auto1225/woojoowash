"use client";

import { useState } from "react";
import { IconCard } from "@/components/icons";

export type PayMethod = "EASY" | "CARD";

export type CardInfo = {
  number: string; // 16 자리 (자릿수만 검증)
  expiry: string; // MM/YY
  cvc: string;
  password2: string; // 비밀번호 앞 2자리
};

export const EMPTY_CARD: CardInfo = {
  number: "",
  expiry: "",
  cvc: "",
  password2: "",
};

export function isCardValid(c: CardInfo): boolean {
  const num = c.number.replace(/\s/g, "");
  if (num.length < 15 || num.length > 16) return false;
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(c.expiry)) return false;
  if (c.cvc.length !== 3) return false;
  if (c.password2.length !== 2) return false;
  return true;
}

export function PaymentMethodSelector({
  method,
  onMethodChange,
  card,
  onCardChange,
}: {
  method: PayMethod;
  onMethodChange: (m: PayMethod) => void;
  card: CardInfo;
  onCardChange: (c: CardInfo) => void;
}) {
  return (
    <section className="px-5 pt-3">
      <div className="bg-white rounded-[20px] border border-fog px-6 py-5">
        <div className="text-[16px] font-extrabold mb-4">결제 수단</div>

        {/* 우주워시 간편결제 */}
        <button
          type="button"
          onClick={() => onMethodChange("EASY")}
          className="w-full flex items-center gap-3 py-3 border-t border-fog text-left"
        >
          <Radio active={method === "EASY"} accent />
          <div className="flex-1 text-[14px] font-bold">우주워시 간편결제</div>
          <span className="text-[10px] font-bold text-white bg-accent rounded-md px-[6px] py-[3px]">
            1초 결제
          </span>
          {method === "EASY" && (
            <span className="text-[12px] font-semibold text-accent">
              카드 관리
            </span>
          )}
        </button>

        {/* 카드 결제 */}
        <button
          type="button"
          onClick={() => onMethodChange("CARD")}
          className="w-full flex items-center gap-3 py-3 border-t border-fog text-left"
        >
          <Radio active={method === "CARD"} />
          <div className="flex-1 text-[14px] font-bold">카드 결제</div>
          <IconCard size={20} stroke={1.6} className="text-slate" />
        </button>

        {/* 카드 정보 입력 폼 */}
        {method === "CARD" && (
          <div className="mt-4 pt-4 border-t border-fog flex flex-col gap-3">
            <Field label="카드 번호">
              <input
                type="text"
                inputMode="numeric"
                value={card.number}
                onChange={(e) =>
                  onCardChange({
                    ...card,
                    number: formatCardNumber(e.target.value),
                  })
                }
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                className="w-full h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink ww-num"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="유효기간">
                <input
                  type="text"
                  inputMode="numeric"
                  value={card.expiry}
                  onChange={(e) =>
                    onCardChange({
                      ...card,
                      expiry: formatExpiry(e.target.value),
                    })
                  }
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink ww-num"
                />
              </Field>
              <Field label="CVC">
                <input
                  type="password"
                  inputMode="numeric"
                  value={card.cvc}
                  onChange={(e) =>
                    onCardChange({
                      ...card,
                      cvc: e.target.value.replace(/[^\d]/g, "").slice(0, 3),
                    })
                  }
                  placeholder="3자리"
                  maxLength={3}
                  className="w-full h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink ww-num"
                />
              </Field>
            </div>
            <Field
              label="비밀번호 앞 2자리"
              hint="카드 비밀번호 4자리 중 앞 2자리"
            >
              <input
                type="password"
                inputMode="numeric"
                value={card.password2}
                onChange={(e) =>
                  onCardChange({
                    ...card,
                    password2: e.target.value
                      .replace(/[^\d]/g, "")
                      .slice(0, 2),
                  })
                }
                placeholder="00"
                maxLength={2}
                className="w-32 h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink ww-num"
              />
            </Field>
            <div className="text-[11px] text-slate leading-[1.6] mt-1">
              * 입력한 카드 정보는 결제 처리에만 사용되며 별도 저장되지 않아요.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Radio({ active, accent }: { active: boolean; accent?: boolean }) {
  if (active) {
    return (
      <span
        className={`w-5 h-5 rounded-full inline-flex items-center justify-center shrink-0 ${
          accent ? "bg-accent" : "bg-ink"
        }`}
      >
        <span className="w-[8px] h-[8px] rounded-full bg-white" />
      </span>
    );
  }
  return (
    <span className="w-5 h-5 rounded-full border-[1.5px] border-fog shrink-0" />
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-bold mb-[6px] block">{label}</span>
      {children}
      {hint && (
        <span className="text-[11px] text-slate mt-1 block">{hint}</span>
      )}
    </label>
  );
}

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}
