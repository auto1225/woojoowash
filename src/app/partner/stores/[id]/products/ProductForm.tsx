"use client";

import { useState } from "react";

const TYPE_TABS = [
  { value: "SELF", label: "셀프세차" },
  { value: "HAND", label: "손세차" },
  { value: "PICKUP", label: "배달세차" },
  { value: "VISIT", label: "출장세차" },
] as const;

type ProductTypeValue = (typeof TYPE_TABS)[number]["value"];

const VALID_TYPES = new Set<string>(TYPE_TABS.map((t) => t.value));

export function ProductForm({
  action,
  defaults,
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaults?: {
    title?: string;
    subtitle?: string;
    description?: string;
    type?: string;
    price?: number;
    durationMin?: number;
    imageUrl?: string;
    cautions?: string;
  };
}) {
  const d = defaults ?? {};
  const initialType: ProductTypeValue =
    d.type && VALID_TYPES.has(d.type) ? (d.type as ProductTypeValue) : "HAND";
  const [type, setType] = useState<ProductTypeValue>(initialType);

  return (
    <form
      action={action}
      className="bg-white border border-fog rounded-[20px] p-8 max-w-[760px] grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      {/* 유형 — 가로 탭 (한 개만 선택) */}
      <div className="md:col-span-2">
        <span className="text-[12px] font-bold mb-[8px] block">
          유형 <span className="text-danger ml-1">*</span>
        </span>
        <div
          role="tablist"
          aria-label="상품 유형"
          className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1 bg-paper border border-fog rounded-[14px]"
        >
          {TYPE_TABS.map((t) => {
            const active = type === t.value;
            return (
              <button
                key={t.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setType(t.value)}
                className={`h-11 rounded-[10px] text-[13px] font-bold transition ${
                  active
                    ? "bg-ink text-white shadow-[0_4px_14px_rgba(10,10,11,0.18)]"
                    : "text-graphite hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        {/* 폼 제출용 */}
        <input type="hidden" name="type" value={type} />
        {d.type && !VALID_TYPES.has(d.type) && (
          <div className="mt-2 text-[11px] text-slate">
            기존 유형 ({d.type}) 은 더 이상 지원되지 않아 손세차로 자동 전환됐어요. 저장 시 변경됩니다.
          </div>
        )}
      </div>

      <Field
        label="상품명"
        name="title"
        defaultValue={d.title}
        required
        className="md:col-span-2"
      />
      <Field
        label="부제"
        name="subtitle"
        defaultValue={d.subtitle}
        className="md:col-span-2"
      />
      <label className="block md:col-span-2">
        <span className="text-[12px] font-bold mb-[6px] block">
          상품 설명
        </span>
        <textarea
          name="description"
          defaultValue={d.description}
          rows={4}
          className="w-full p-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink resize-none"
        />
      </label>

      <Field
        label="소요 (분)"
        name="durationMin"
        type="number"
        defaultValue={String(d.durationMin ?? 60)}
        required
      />
      <Field
        label="가격 (원)"
        name="price"
        type="number"
        defaultValue={String(d.price ?? 0)}
        required
      />
      <Field
        label="대표 이미지 URL"
        name="imageUrl"
        defaultValue={d.imageUrl}
        placeholder="https://…"
        className="md:col-span-2"
      />

      <label className="block md:col-span-2">
        <span className="text-[12px] font-bold mb-[6px] block">
          유의사항 (한 줄에 한 개)
        </span>
        <textarea
          name="cautions"
          defaultValue={d.cautions}
          rows={3}
          className="w-full p-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink resize-none"
          placeholder="예:&#10;차량 상태에 따라 추가요금이 발생할 수 있어요&#10;잔여물 제거는 기본 범위에 포함돼요"
        />
      </label>

      <button
        type="submit"
        className="md:col-span-2 justify-self-start h-11 px-6 rounded-full bg-ink text-white font-bold text-[14px]"
      >
        저장
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  type = "text",
  className,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-[12px] font-bold mb-[6px] block">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink"
      />
    </label>
  );
}
