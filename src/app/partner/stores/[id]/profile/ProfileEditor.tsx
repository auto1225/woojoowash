"use client";

import { useState } from "react";
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
  const [coverImages, setCoverImages] = useState<string[]>(
    defaults.coverImages.length > 0 ? defaults.coverImages : [""],
  );

  const visible = coverImages.slice(0, maxImages);
  const validImages = visible.filter((u) => u.trim().length > 0);

  function addImage() {
    if (coverImages.length >= maxImages) return;
    setCoverImages((cur) => [...cur, ""]);
  }
  function removeImage(idx: number) {
    setCoverImages((cur) => cur.filter((_, i) => i !== idx));
  }
  function updateImage(idx: number, value: string) {
    setCoverImages((cur) => cur.map((v, i) => (i === idx ? value : v)));
  }
  function moveImage(idx: number, delta: number) {
    setCoverImages((cur) => {
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
                (최대 {maxImages}장)
              </span>
            </span>
            <span className="text-[11px] text-slate">
              {visible.length} / {maxImages}
            </span>
          </div>
          <div className="text-[11px] text-slate mb-3 leading-[1.6]">
            첫 번째 이미지가 매장 카드 대표로, 나머지는 매장 상세 상단 슬라이드로
            노출됩니다.
          </div>

          <div className="flex flex-col gap-2">
            {visible.map((url, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate w-5 text-center shrink-0 ww-num">
                  {i + 1}
                </span>
                <input
                  type="text"
                  name="coverUrls"
                  value={url}
                  onChange={(e) => updateImage(i, e.target.value)}
                  placeholder="https://…"
                  className="flex-1 h-11 px-3 bg-paper border border-fog rounded-[10px] text-[13px] outline-none focus:border-brand-deep"
                />
                <div className="flex items-center gap-1 shrink-0">
                  <IconBtn
                    label="위로"
                    disabled={i === 0}
                    onClick={() => moveImage(i, -1)}
                  >
                    ↑
                  </IconBtn>
                  <IconBtn
                    label="아래로"
                    disabled={i === visible.length - 1}
                    onClick={() => moveImage(i, 1)}
                  >
                    ↓
                  </IconBtn>
                  <IconBtn
                    label="삭제"
                    onClick={() => removeImage(i)}
                    danger
                  >
                    ×
                  </IconBtn>
                </div>
              </div>
            ))}
          </div>

          {visible.length < maxImages && (
            <button
              type="button"
              onClick={addImage}
              className="mt-3 h-10 px-4 rounded-full border-[1.5px] border-dashed border-fog text-[12px] font-bold text-slate hover:border-brand-deep hover:text-brand-deep transition"
            >
              + 이미지 추가
            </button>
          )}
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
          앱에서 고객에게 보이는 모습 (라이브 미리보기)
        </div>
        <AppPreview
          name={name || "매장 이름"}
          address={address || "주소를 입력해 주세요"}
          phone={phone}
          promo={promo}
          open={open}
          coverImages={validImages}
          rating={defaults.rating}
          reviewCount={defaults.reviewCount}
          services={defaults.services}
        />
      </aside>
    </div>
  );
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

function IconBtn({
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
      className={`w-8 h-8 rounded-full border text-[13px] font-bold transition disabled:opacity-30 ${
        danger
          ? "border-fog text-danger hover:bg-danger/10"
          : "border-fog text-slate hover:bg-cloud"
      }`}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// 우측 미리보기 — 앱의 /app/stores/[id] 매장 상세 화면 단순 재현
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
  const cover = coverImages[Math.min(activeImg, coverImages.length - 1)];

  return (
    <div className="rounded-[28px] border-[6px] border-ink overflow-hidden bg-white shadow-[0_24px_60px_rgba(15,124,114,0.18)]">
      {/* 폰 상단 노치 영역 */}
      <div className="h-[26px] bg-ink flex items-center justify-center">
        <span className="w-[80px] h-[14px] rounded-full bg-charcoal" />
      </div>

      <div className="bg-paper">
        {/* 매장 상세 헤더 */}
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

          {/* 영업 상태 */}
          <span
            className={`absolute right-3 top-3 text-[10px] font-bold px-[8px] py-[3px] rounded-full ${
              open
                ? "bg-brand text-ink"
                : "bg-ash/90 text-white"
            }`}
          >
            {open ? "영업중" : "영업종료"}
          </span>

          {/* 서비스 칩 + 매장명 */}
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
        </div>

        {/* 이미지 인디케이터 */}
        {coverImages.length > 1 && (
          <div className="flex justify-center gap-1 py-2 bg-paper">
            {coverImages.map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-[6px] h-[6px] rounded-full transition ${
                  i === activeImg ? "bg-ink" : "bg-fog"
                }`}
                aria-label={`이미지 ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* 본문 */}
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
