"use client";

import { useEffect, useRef, useState } from "react";
import { StoreLocationPicker } from "@/components/partner/StoreLocationPicker";
import { labelServices } from "@/lib/services";

type Defaults = {
  name: string;
  address: string;
  phone: string;
  promo: string;
  open: boolean;
  lat: number | null;
  lng: number | null;
  coverImages: string[];
  rating: number;
  reviewCount: number;
  services: string[];
};

// 이미지 슬롯 — 기존 URL 또는 새로 추가된 파일
type ImageItem =
  | { id: string; kind: "url"; url: string }
  | { id: string; kind: "file"; file: File; previewUrl: string };

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPE = /^image\/(jpeg|png|webp|gif)$/;

export function ProfileEditor({
  action,
  clientId,
  defaults,
  maxImages,
}: {
  action: (formData: FormData) => void | Promise<void>;
  clientId: string | null;
  defaults: Defaults;
  maxImages: number;
}) {
  const [name, setName] = useState(defaults.name);
  const [address, setAddress] = useState(defaults.address);
  const [phone, setPhone] = useState(defaults.phone);
  const [promo, setPromo] = useState(defaults.promo);
  const [open, setOpen] = useState(defaults.open);

  const [items, setItems] = useState<ImageItem[]>(() =>
    defaults.coverImages.map((url, i) => ({
      id: `existing-${i}`,
      kind: "url",
      url,
    })),
  );
  const [error, setError] = useState<string | null>(null);
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

  const previewUrls = items
    .map((it) => (it.kind === "url" ? it.url : it.previewUrl))
    .filter(Boolean);

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const files = Array.from(e.target.files ?? []);
    if (e.target) e.target.value = ""; // 같은 파일 재선택 가능

    const room = maxImages - items.length;
    if (files.length === 0) return;
    if (room <= 0) {
      setError(`이미지는 최대 ${maxImages}장까지 가능해요.`);
      return;
    }
    const accepted: ImageItem[] = [];
    for (const f of files.slice(0, room)) {
      if (!ALLOWED_TYPE.test(f.type)) {
        setError("JPG / PNG / WEBP / GIF 만 업로드 가능해요.");
        continue;
      }
      if (f.size > MAX_BYTES) {
        setError("5MB 이하의 이미지를 올려주세요.");
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
      setError(`최대 ${maxImages}장이라 ${room}개만 추가했어요.`);
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
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      {/* 좌측: 입력 폼 */}
      <form
        action={action}
        className="bg-white border border-fog rounded-[20px] p-8 flex flex-col gap-5"
      >
        <Field
          label="매장 이름"
          required
          input={
            <input
              type="text"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
            />
          }
        />
        <Field
          label="주소"
          required
          hint="앱 매장 상세·리스트에 표시됩니다."
          input={
            <input
              type="text"
              name="address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={inputCls}
            />
          }
        />
        <Field
          label="전화번호"
          input={
            <input
              type="text"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="02-000-0000"
              className={inputCls}
            />
          }
        />

        {/* 다중 커버 이미지 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-bold">
              커버 이미지{" "}
              <span className="text-slate font-medium ml-1">
                (최대 {maxImages}장 · 5MB · JPG/PNG/WEBP)
              </span>
            </span>
            <span className="text-[11px] text-slate">
              {items.length} / {maxImages}
            </span>
          </div>
          <div className="text-[11px] text-slate mb-3 leading-[1.6]">
            첫 번째 이미지가 매장 카드 대표로, 전체는 매장 상세 상단에 가로 슬라이드 갤러리로 노출됩니다.
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
                      <SmallBtn
                        danger
                        onClick={() => removeAt(i)}
                        label="삭제"
                      >
                        ×
                      </SmallBtn>
                    </div>

                    {/* 폼 제출 시 사용될 hidden 입력 */}
                    <input type="hidden" name="coverItemKind" value={it.kind} />
                    {it.kind === "url" && (
                      <input
                        type="hidden"
                        name="coverItemUrl"
                        value={it.url}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {/* 새 파일 input — 별도 form field 로 다중 첨부 */}
          {items.length < maxImages && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                name="coverNewFiles"
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
          {error && (
            <div className="text-[12px] text-danger mt-2">{error}</div>
          )}

          {/* 파일 입력은 자동 hidden 첨부 — 폼 제출 시 file 의 순서를 보장하기 위해 */}
          <FilePayloadFields items={items} />
        </div>

        <Field
          label="홍보 문구"
          hint="앱 매장 상세 상단의 작은 카드에 표시됩니다."
          input={
            <textarea
              name="promo"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              rows={3}
              className={`${inputCls} h-auto py-3 resize-none`}
              placeholder="예: 주말 할인 진행중! 프리미엄 코스 10% 할인"
            />
          }
        />

        <div>
          <div className="text-[12px] font-bold mb-[6px]">
            매장 위치 <span className="text-danger">*</span>
          </div>
          <div className="text-[11px] text-slate mb-3 leading-[1.6]">
            지도를 클릭해 매장 위치를 핀으로 고정하세요. 앱의 매장 찾기 지도에서 이 좌표로 마커가 표시됩니다.
          </div>
          <StoreLocationPicker
            clientId={clientId}
            initialLat={defaults.lat}
            initialLng={defaults.lng}
          />
        </div>

        <label className="flex items-center gap-2 text-[13px]">
          <input
            type="checkbox"
            name="open"
            checked={open}
            onChange={(e) => setOpen(e.target.checked)}
            className="w-4 h-4 accent-brand-deep"
          />
          현재 영업 중 (체크 해제 시 앱에 "영업종료"로 표시)
        </label>

        <button
          type="submit"
          className="self-start h-11 px-6 rounded-full btn-brand text-[14px]"
        >
          저장
        </button>
      </form>

      {/* 우측: 미리보기 */}
      <aside className="lg:sticky lg:top-[120px] lg:h-fit">
        <div className="text-[12px] font-bold text-brand-deep tracking-[0.1em] mb-2">
          PREVIEW
        </div>
        <div className="text-[11px] text-slate mb-3">
          앱에서 고객에게 보이는 모습 (실시간 미리보기)
        </div>
        <AppPreview
          name={name || "매장 이름"}
          address={address || "주소를 입력해 주세요"}
          phone={phone}
          promo={promo}
          open={open}
          coverImages={previewUrls}
          rating={defaults.rating}
          reviewCount={defaults.reviewCount}
          services={defaults.services}
        />
      </aside>
    </div>
  );
}

/**
 * 파일 항목들을 hidden input 으로 폼에 첨부.
 * file 항목 순서를 유지하기 위해 별도 컴포넌트로 분리.
 */
function FilePayloadFields({ items }: { items: ImageItem[] }) {
  // 파일은 file input 으로 직접 attach 하기 위해 ref 사용
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // 모든 file input 비우고 다시 채움
    containerRef.current.innerHTML = "";
    items.forEach((it) => {
      if (it.kind !== "file") return;
      const input = document.createElement("input");
      input.type = "file";
      input.name = "coverItemFile";
      input.style.display = "none";
      // DataTransfer 로 File 을 file input 에 주입 (브라우저 지원: 모던 전부)
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

const inputCls =
  "w-full h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-brand-deep transition";

function Field({
  label,
  required,
  hint,
  input,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  input: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-bold mb-[6px] block">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </span>
      {input}
      {hint && (
        <span className="text-[11px] text-slate mt-1 block">{hint}</span>
      )}
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

// ─────────────────────────────────────────────────────────────
// 우측 미리보기 — 앱의 /app/stores/[id] 매장 상세 화면 단순 재현
// 가로 스와이프 갤러리 형태
// ─────────────────────────────────────────────────────────────
function AppPreview({
  name,
  address,
  phone,
  promo,
  open,
  coverImages,
  rating,
  reviewCount,
  services,
}: {
  name: string;
  address: string;
  phone: string;
  promo: string;
  open: boolean;
  coverImages: string[];
  rating: number;
  reviewCount: number;
  services: string[];
}) {
  const [activeImg, setActiveImg] = useState(0);
  const labels = labelServices(services);
  const hasImages = coverImages.length > 0;
  const cover = hasImages
    ? coverImages[Math.min(activeImg, coverImages.length - 1)]
    : null;

  return (
    <div className="rounded-[28px] border-[6px] border-ink overflow-hidden bg-white shadow-[0_24px_60px_rgba(15,124,114,0.18)]">
      {/* 폰 상단 노치 */}
      <div className="h-[26px] bg-ink flex items-center justify-center">
        <span className="w-[80px] h-[14px] rounded-full bg-charcoal" />
      </div>

      <div className="bg-paper">
        {/* 매장 상세 헤더 — 갤러리 */}
        <div className="relative h-[300px] bg-cloud overflow-hidden">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[12px] text-slate">
              커버 이미지를 추가해 주세요
            </div>
          )}
          {cover && (
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          )}

          {/* 좌상단 뒤로가기 mock */}
          <span className="absolute left-3 top-3 w-8 h-8 rounded-full bg-black/30 ww-backdrop-glass flex items-center justify-center text-white text-[14px]">
            ‹
          </span>

          <span
            className={`absolute right-3 top-3 text-[10px] font-bold px-[8px] py-[3px] rounded-full ${
              open ? "bg-brand text-ink" : "bg-ash/90 text-white"
            }`}
          >
            {open ? "영업중" : "영업종료"}
          </span>

          <div className="absolute left-3 right-3 bottom-3 text-white">
            {labels.length > 0 && (
              <div className="flex gap-1 mb-2">
                {labels.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="text-[9px] font-bold px-2 py-[2px] rounded-full bg-white/20 ww-backdrop-glass border border-white/20"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="ww-disp text-[20px] tracking-[-0.02em] leading-[1.2] truncate">
              {name}
            </div>
          </div>

          {/* 카운터 */}
          {coverImages.length > 1 && (
            <span className="absolute right-3 bottom-3 text-[10px] bg-black/40 text-white rounded-full px-2 py-[2px] ww-num">
              {activeImg + 1} / {coverImages.length}
            </span>
          )}
        </div>

        {/* 인디케이터 */}
        {coverImages.length > 1 && (
          <div className="flex justify-center gap-1 py-2 bg-paper">
            {coverImages.map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setActiveImg(i)}
                className={`h-[6px] rounded-full transition ${
                  i === activeImg
                    ? "w-[18px] bg-ink"
                    : "w-[6px] bg-fog hover:bg-mist"
                }`}
                aria-label={`이미지 ${i + 1}`}
              />
            ))}
          </div>
        )}

        <div className="bg-white px-4 pt-4 pb-5 min-h-[260px]">
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-ink">★</span>
            <span className="font-bold">{rating.toFixed(1)}</span>
            <span className="text-slate">({reviewCount})</span>
          </div>
          <div className="text-[11px] text-slate mt-2 truncate">{address}</div>
          {phone && (
            <div className="text-[11px] text-slate ww-num mt-1">{phone}</div>
          )}

          {promo && (
            <div className="mt-3 rounded-[10px] bg-brand-bg border border-brand/30 p-3">
              <div className="text-[10px] font-bold text-brand-deep tracking-[0.05em] mb-1">
                매장 안내
              </div>
              <div className="text-[12px] text-graphite leading-[1.5] whitespace-pre-wrap">
                {promo}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 mt-4 border-t border-fog">
            {["상품", "정보", "리뷰"].map((t, i) => (
              <div
                key={t}
                className={`py-2 text-center text-[11px] font-bold ${
                  i === 0 ? "text-ink border-b-2 border-ink" : "text-slate"
                }`}
              >
                {t}
              </div>
            ))}
          </div>
          <div className="text-[10px] text-slate text-center py-6">
            (상품 리스트 영역)
          </div>
        </div>
      </div>
    </div>
  );
}
