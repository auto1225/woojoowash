"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import {
  INITIAL_SAVE_STATE,
  SaveButton,
  SaveToast,
  type SaveActionState,
} from "@/components/admin/SaveToast";

const TYPE_TABS = [
  { value: "SELF", label: "셀프세차" },
  { value: "HAND", label: "손세차" },
  { value: "PICKUP", label: "배달세차" },
  { value: "VISIT", label: "출장세차" },
] as const;

type ProductTypeValue = (typeof TYPE_TABS)[number]["value"];

const VALID_TYPES = new Set<string>(TYPE_TABS.map((t) => t.value));

const MAX_IMAGES = 5;
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPE = /^image\/(jpeg|png|webp|gif)$/;

const MAX_OPTIONS = 20;

type ImageItem =
  | { id: string; kind: "url"; url: string }
  | { id: string; kind: "file"; file: File; previewUrl: string };

type OptionPriceMode = "amount" | "ask";

type OptionItem = {
  uid: string; // 클라이언트 키
  id: string; // 기존 옵션 id (없으면 빈 문자열)
  label: string;
  priceMode: OptionPriceMode;
  price: string; // input 입력값 (string)
  durationMin: string; // 분 (string, 빈값 허용)
};

const PRICE_MODE_TABS: ReadonlyArray<{
  value: OptionPriceMode;
  label: string;
}> = [
  { value: "amount", label: "금액" },
  { value: "ask", label: "협의" },
];

// 가격 표시용 — 입력은 raw digit string ("40000") 으로 보관, 표시만 ko-KR 쉼표 포맷.
function formatComma(s: string): string {
  if (!s) return "";
  const n = Number(s);
  if (!Number.isFinite(n)) return s;
  return n.toLocaleString("ko-KR");
}
const MAX_PRICE = 99_999_999; // 8 자리 — 가격 상한
function clampPriceDigits(raw: string): string {
  // 숫자만 추출 → 8 자리로 컷
  const digits = raw.replace(/[^\d]/g, "").slice(0, 8);
  if (!digits) return "";
  // 안전하게 한 번 더 클램프
  const n = Number(digits);
  return Number.isFinite(n) ? String(Math.min(MAX_PRICE, Math.max(0, n))) : "";
}
const MAX_DURATION = 1440; // 분, 24시간
function clampDurationDigits(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "").slice(0, 4); // 1440 = 4 자리
  if (!digits) return "";
  const n = Number(digits);
  return Number.isFinite(n)
    ? String(Math.min(MAX_DURATION, Math.max(0, n)))
    : "";
}

export function ProductForm({
  action,
  defaults,
}: {
  action: (
    prev: SaveActionState,
    formData: FormData,
  ) => Promise<SaveActionState>;
  defaults?: {
    title?: string;
    subtitle?: string;
    description?: string;
    type?: string;
    price?: number;
    durationMin?: number;
    images?: string[];
    cautions?: string;
    options?: Array<{
      id: string;
      label: string;
      price: number;
      // 레거시 "free" 가 들어올 수 있어 union 으로 받음 → 내부에서 amount 로 정규화
      priceMode?: "amount" | "ask" | "free";
      durationMin?: number | null;
    }>;
  };
}) {
  const d = defaults ?? {};
  const initialType: ProductTypeValue =
    d.type && VALID_TYPES.has(d.type) ? (d.type as ProductTypeValue) : "HAND";
  const [type, setType] = useState<ProductTypeValue>(initialType);
  const [priceStr, setPriceStr] = useState<string>(
    d.price && d.price > 0 ? String(d.price) : "",
  );
  const [durationStr, setDurationStr] = useState<string>(
    d.durationMin != null ? String(d.durationMin) : "60",
  );
  const [saveState, formAction] = useFormState(action, INITIAL_SAVE_STATE);

  const [items, setItems] = useState<ImageItem[]>(() =>
    (d.images ?? []).map((url, i) => ({
      id: `existing-${i}`,
      kind: "url",
      url,
    })),
  );

  const [options, setOptions] = useState<OptionItem[]>(() =>
    (d.options ?? []).map((o, i) => ({
      uid: `existing-opt-${i}-${o.id || ""}`,
      id: o.id ?? "",
      label: o.label ?? "",
      // 레거시 "free" 는 amount + 가격 0 으로 정규화 (UI 에서는 빈 가격으로 표시)
      priceMode: (o.priceMode === "ask" ? "ask" : "amount") as OptionPriceMode,
      price: o.price > 0 ? String(o.price) : "",
      durationMin:
        o.durationMin != null && o.durationMin > 0 ? String(o.durationMin) : "",
    })),
  );

  function addOption() {
    setOptions((cur) =>
      cur.length >= MAX_OPTIONS
        ? cur
        : [
            ...cur,
            {
              uid: `opt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              id: "",
              label: "",
              priceMode: "amount",
              price: "",
              durationMin: "",
            },
          ],
    );
  }
  function removeOption(idx: number) {
    setOptions((cur) => cur.filter((_, i) => i !== idx));
  }
  function moveOption(idx: number, delta: number) {
    setOptions((cur) => {
      const next = [...cur];
      const t = idx + delta;
      if (t < 0 || t >= next.length) return cur;
      [next[idx], next[t]] = [next[t], next[idx]];
      return next;
    });
  }
  function updateOption<K extends keyof OptionItem>(
    idx: number,
    key: K,
    value: OptionItem[K],
  ) {
    setOptions((cur) =>
      cur.map((o, i) => (i === idx ? { ...o, [key]: value } : o)),
    );
  }
  const [imgError, setImgError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 ObjectURL 정리
  useEffect(() => {
    return () => {
      items.forEach((it) => {
        if (it.kind === "file") URL.revokeObjectURL(it.previewUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    setImgError(null);
    const files = Array.from(e.target.files ?? []);
    if (e.target) e.target.value = "";

    const room = MAX_IMAGES - items.length;
    if (files.length === 0) return;
    if (room <= 0) {
      setImgError(`이미지는 최대 ${MAX_IMAGES}장까지 가능해요.`);
      return;
    }
    const accepted: ImageItem[] = [];
    for (const f of files.slice(0, room)) {
      if (!ALLOWED_TYPE.test(f.type)) {
        setImgError("JPG / PNG / WEBP / GIF 만 업로드 가능해요.");
        continue;
      }
      if (f.size > MAX_BYTES) {
        setImgError("5MB 이하의 이미지를 올려주세요.");
        continue;
      }
      accepted.push({
        id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        kind: "file",
        file: f,
        previewUrl: URL.createObjectURL(f),
      });
    }
    if (files.length > room) {
      setImgError(`최대 ${MAX_IMAGES}장이라 ${room}개만 추가했어요.`);
    }
    if (accepted.length > 0) {
      setItems((cur) => [...cur, ...accepted]);
    }
  }
  function removeAt(idx: number) {
    setItems((cur) => {
      const it = cur[idx];
      if (it && it.kind === "file") URL.revokeObjectURL(it.previewUrl);
      return cur.filter((_, i) => i !== idx);
    });
  }
  function move(idx: number, delta: number) {
    setItems((cur) => {
      const next = [...cur];
      const target = idx + delta;
      if (target < 0 || target >= next.length) return cur;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  return (
    <form
      action={formAction}
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
        <input type="hidden" name="type" value={type} />
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

      <label className="block">
        <span className="text-[12px] font-bold mb-[6px] block">
          소요 (분) <span className="text-danger ml-1">*</span>
        </span>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            required
            value={durationStr}
            onChange={(e) =>
              setDurationStr(clampDurationDigits(e.target.value))
            }
            placeholder="60"
            className="w-full h-12 pl-4 pr-9 bg-paper border border-fog rounded-[12px] text-[14px] ww-num text-right outline-none focus:border-ink"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-slate pointer-events-none">
            분
          </span>
          <input
            type="hidden"
            name="durationMin"
            value={durationStr || "0"}
          />
        </div>
        <span className="text-[11px] text-slate mt-1 block">
          최대 1,440분 (24시간)
        </span>
      </label>
      <label className="block">
        <span className="text-[12px] font-bold mb-[6px] block">
          가격 (원) <span className="text-danger ml-1">*</span>
        </span>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            required
            value={formatComma(priceStr)}
            onChange={(e) => setPriceStr(clampPriceDigits(e.target.value))}
            placeholder="0"
            className="w-full h-12 pl-4 pr-9 bg-paper border border-fog rounded-[12px] text-[14px] ww-num text-right outline-none focus:border-ink"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-slate ww-num pointer-events-none">
            원
          </span>
          {/* 폼 제출 — 쉼표 없는 raw 값 */}
          <input type="hidden" name="price" value={priceStr || "0"} />
        </div>
      </label>

      {/* 상품 이미지 — 다중 업로드 (최대 5장) */}
      <div className="md:col-span-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-bold">
            상품 이미지{" "}
            <span className="text-slate font-medium ml-1">
              (최대 {MAX_IMAGES}장 · 5MB · JPG/PNG/WEBP)
            </span>
          </span>
          <span className="text-[11px] text-slate">
            {items.length} / {MAX_IMAGES}
          </span>
        </div>
        <div className="text-[11px] text-slate mb-3 leading-[1.6]">
          첫 번째 이미지가 매장 상품 카드의 대표 썸네일로, 전체는 상품 상세 화면에 노출됩니다.
          저장을 누르면 이미지 서버에 업로드된 후 DB 에 URL 만 저장됩니다.
        </div>

        {items.length > 0 && (
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            {items.map((it, i) => {
              const url = it.kind === "url" ? it.url : it.previewUrl;
              return (
                <li
                  key={it.id}
                  className="relative group rounded-[12px] overflow-hidden border border-fog bg-cloud aspect-[4/3]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute left-2 top-2 text-[10px] font-bold bg-ink text-white rounded-full px-2 py-[2px] ww-num">
                    {i + 1}
                    {i === 0 && " · 대표"}
                  </span>
                  {it.kind === "file" && (
                    <span className="absolute right-2 top-2 text-[9px] font-bold bg-brand text-ink rounded-full px-2 py-[2px]">
                      NEW
                    </span>
                  )}
                  <div className="absolute left-1 right-1 bottom-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <SmallBtn
                      disabled={i === 0}
                      onClick={() => move(i, -1)}
                      label="앞으로"
                    >
                      ←
                    </SmallBtn>
                    <SmallBtn
                      disabled={i === items.length - 1}
                      onClick={() => move(i, 1)}
                      label="뒤로"
                    >
                      →
                    </SmallBtn>
                    <SmallBtn danger onClick={() => removeAt(i)} label="삭제">
                      ×
                    </SmallBtn>
                  </div>

                  {/* 폼 제출 — 메타 (kind + url 은 인라인) */}
                  <input type="hidden" name="productImageKind" value={it.kind} />
                  {it.kind === "url" && (
                    <input
                      type="hidden"
                      name="productImageUrl"
                      value={it.url}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {items.length < MAX_IMAGES && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={onPickFiles}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-10 px-4 rounded-full border-[1.5px] border-dashed border-fog text-[12px] font-bold text-slate hover:border-brand-deep hover:text-brand-deep transition"
            >
              + 이미지 파일 추가
            </button>
          </>
        )}
        {imgError && (
          <div className="text-[12px] text-danger mt-2">{imgError}</div>
        )}

        {/* 파일 hidden inputs (DataTransfer 로 폼 첨부) */}
        <FilePayloadFields items={items} />
      </div>

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

      {/* 추가 옵션 — 앱 상품 상세에서 "추가 옵션" 영역에 노출 */}
      <div className="md:col-span-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-bold">
            추가 옵션{" "}
            <span className="text-slate font-medium ml-1">
              (앱 상품 상세 "추가 옵션" 영역에 노출 · 최대 {MAX_OPTIONS}개)
            </span>
          </span>
          <span className="text-[11px] text-slate">
            {options.length} / {MAX_OPTIONS}
          </span>
        </div>
        <div className="text-[11px] text-slate mb-3 leading-[1.6]">
          <strong>금액</strong> 모드에서 가격을 비워두면 자동으로{" "}
          <strong>무료</strong> 로 표시돼요. 가격이 정해지지 않았다면{" "}
          <strong>협의</strong> 모드를 선택하세요. 소요시간은 비워두면 표시되지
          않아요.
        </div>

        {options.length > 0 && (
          <ul className="flex flex-col gap-3 mb-3">
            {options.map((o, i) => (
              <li
                key={o.uid}
                className="rounded-[12px] border border-fog bg-paper p-3 grid grid-cols-1 md:grid-cols-[1fr_auto_108px_84px_auto] gap-2 items-stretch"
              >
                <input
                  type="text"
                  value={o.label}
                  onChange={(e) =>
                    updateOption(i, "label", e.target.value)
                  }
                  placeholder="옵션명 (예: 유리 코팅 (6개월))"
                  className="h-11 px-3 bg-white border border-fog rounded-[10px] text-[14px] outline-none focus:border-ink"
                />
                <div
                  role="tablist"
                  aria-label="가격 모드"
                  className="inline-flex h-11 p-[3px] bg-white border border-fog rounded-[10px]"
                >
                  {PRICE_MODE_TABS.map((m) => {
                    const active = o.priceMode === m.value;
                    return (
                      <button
                        key={m.value}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => updateOption(i, "priceMode", m.value)}
                        className={`px-3 rounded-[8px] text-[12px] font-bold transition ${
                          active
                            ? "bg-ink text-white"
                            : "text-graphite hover:text-ink"
                        }`}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={
                      o.priceMode === "amount" ? formatComma(o.price) : ""
                    }
                    onChange={(e) =>
                      updateOption(i, "price", clampPriceDigits(e.target.value))
                    }
                    disabled={o.priceMode !== "amount"}
                    placeholder={
                      o.priceMode === "amount" ? "가격" : "—"
                    }
                    className="h-11 w-full pr-6 pl-2 bg-white border border-fog rounded-[10px] text-[14px] ww-num text-right outline-none focus:border-ink disabled:bg-cloud disabled:text-slate"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-slate ww-num pointer-events-none">
                    원
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={o.durationMin}
                    onChange={(e) =>
                      updateOption(
                        i,
                        "durationMin",
                        clampDurationDigits(e.target.value),
                      )
                    }
                    placeholder="소요"
                    className="h-11 w-full pr-6 pl-2 bg-white border border-fog rounded-[10px] text-[14px] ww-num text-right outline-none focus:border-ink"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-slate pointer-events-none">
                    분
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <SmallSquareBtn
                    disabled={i === 0}
                    onClick={() => moveOption(i, -1)}
                    label="위로"
                  >
                    ↑
                  </SmallSquareBtn>
                  <SmallSquareBtn
                    disabled={i === options.length - 1}
                    onClick={() => moveOption(i, 1)}
                    label="아래로"
                  >
                    ↓
                  </SmallSquareBtn>
                  <SmallSquareBtn
                    danger
                    onClick={() => removeOption(i)}
                    label="삭제"
                  >
                    ×
                  </SmallSquareBtn>
                </div>

                {/* 폼 제출용 hidden 평행 배열 */}
                <input type="hidden" name="optionId" value={o.id} />
                <input type="hidden" name="optionLabel" value={o.label} />
                <input
                  type="hidden"
                  name="optionPriceMode"
                  value={o.priceMode}
                />
                <input
                  type="hidden"
                  name="optionPrice"
                  value={o.priceMode === "amount" ? o.price : ""}
                />
                <input
                  type="hidden"
                  name="optionDurationMin"
                  value={o.durationMin}
                />
              </li>
            ))}
          </ul>
        )}

        {options.length < MAX_OPTIONS && (
          <button
            type="button"
            onClick={addOption}
            className="h-10 px-4 rounded-full border-[1.5px] border-dashed border-fog text-[12px] font-bold text-slate hover:border-brand-deep hover:text-brand-deep transition"
          >
            + 추가 옵션
          </button>
        )}
      </div>

      <div className="md:col-span-2">
        <SaveButton />
      </div>
      <SaveToast state={saveState} />
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
  step,
  min,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  className?: string;
  step?: number;
  min?: number;
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
        step={step}
        min={min}
        className="w-full h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink ww-num"
      />
    </label>
  );
}

function SmallBtn({
  children,
  onClick,
  disabled,
  danger,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`flex-1 h-7 rounded-full text-[12px] font-bold backdrop-blur-sm transition disabled:opacity-30 ${
        danger
          ? "bg-danger/85 text-white hover:bg-danger"
          : "bg-white/90 text-ink hover:bg-white"
      }`}
    >
      {children}
    </button>
  );
}

function SmallSquareBtn({
  children,
  onClick,
  disabled,
  danger,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`w-9 h-11 rounded-[8px] text-[14px] font-bold transition disabled:opacity-30 shrink-0 ${
        danger
          ? "bg-danger/10 text-danger hover:bg-danger/20"
          : "bg-white border border-fog text-ink hover:border-brand-deep hover:text-brand-deep"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * 파일 항목들을 hidden file input 으로 폼에 첨부.
 * 파일 순서를 유지하기 위해 DataTransfer 로 직접 attach.
 */
function FilePayloadFields({ items }: { items: ImageItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";
    items.forEach((it) => {
      if (it.kind !== "file") return;
      const input = document.createElement("input");
      input.type = "file";
      input.name = "productImageFile";
      input.style.display = "none";
      try {
        const dt = new DataTransfer();
        dt.items.add(it.file);
        input.files = dt.files;
        containerRef.current!.appendChild(input);
      } catch {
        // unsupported — 무시
      }
    });
  }, [items]);

  return <div ref={containerRef} className="hidden" />;
}
