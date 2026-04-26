"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { StoreLocationPicker } from "@/components/partner/StoreLocationPicker";
import { labelServices, SELECTABLE_SERVICES } from "@/lib/services";

type SaveProfileState = {
  ok: boolean;
  ts: number;
  error?: string;
};

const INITIAL_SAVE_STATE: SaveProfileState = { ok: false, ts: 0 };

// DB·미리보기/앱 표시용 — 직렬화 후의 형태
type InfoSection = {
  title: string;
  subtitle: string;
  content: string;
  images: string[];
};

// 에디터 내부 상태 — 신규 파일도 함께 관리
type InfoImageItem =
  | { id: string; kind: "url"; url: string }
  | { id: string; kind: "file"; file: File; previewUrl: string };

type EditorInfoSection = {
  title: string;
  subtitle: string;
  content: string;
  images: InfoImageItem[];
};

type Defaults = {
  name: string;
  address: string;
  phone: string;
  promo: string;
  open: boolean;
  lat: number | null;
  lng: number | null;
  coverImages: string[];
  infoSections: InfoSection[];
  rating: number;
  reviewCount: number;
  services: string[];
};

const MAX_INFO_SECTIONS = 5;
const MAX_INFO_IMAGES_PER_SECTION = 6;

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
  action: (
    prev: SaveProfileState,
    formData: FormData,
  ) => Promise<SaveProfileState>;
  clientId: string | null;
  defaults: Defaults;
  maxImages: number;
}) {
  const [saveState, formAction] = useFormState(action, INITIAL_SAVE_STATE);
  const [toast, setToast] = useState<
    | { kind: "ok" | "err"; msg: string }
    | null
  >(null);

  // 저장 결과 → 토스트
  useEffect(() => {
    if (saveState.ts === 0) return; // 초기 상태
    if (saveState.ok) {
      setToast({ kind: "ok", msg: "저장이 완료되었습니다." });
    } else {
      setToast({
        kind: "err",
        msg: saveState.error ?? "저장에 실패했어요.",
      });
    }
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [saveState.ts, saveState.ok, saveState.error]);

  const [name, setName] = useState(defaults.name);
  const [address, setAddress] = useState(defaults.address);
  const [phone, setPhone] = useState(defaults.phone);
  const [promo, setPromo] = useState(defaults.promo);
  const [open, setOpen] = useState(defaults.open);
  const [services, setServices] = useState<string[]>(() => {
    // 정의된 코드만 유지하면서 SELECTABLE_SERVICES 순서대로
    const valid = new Set(SELECTABLE_SERVICES.map((s) => s.code));
    return defaults.services.filter((c) => valid.has(c));
  });
  function toggleService(code: string) {
    setServices((cur) =>
      cur.includes(code) ? cur.filter((c) => c !== code) : [...cur, code],
    );
  }

  const [items, setItems] = useState<ImageItem[]>(() =>
    defaults.coverImages.map((url, i) => ({
      id: `existing-${i}`,
      kind: "url",
      url,
    })),
  );
  const [infoSections, setInfoSections] = useState<EditorInfoSection[]>(() =>
    defaults.infoSections.map((s) => ({
      title: s.title,
      subtitle: s.subtitle,
      content: s.content,
      images: s.images.map((url, i) => ({
        id: `existing-info-${i}-${url}`,
        kind: "url" as const,
        url,
      })),
    })),
  );
  const [error, setError] = useState<string | null>(null);
  const [infoError, setInfoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addInfoSection() {
    setInfoSections((cur) =>
      cur.length >= MAX_INFO_SECTIONS
        ? cur
        : [...cur, { title: "", subtitle: "", content: "", images: [] }],
    );
  }
  function removeInfoSection(idx: number) {
    setInfoSections((cur) => {
      const sec = cur[idx];
      if (sec) {
        sec.images.forEach((it) => {
          if (it.kind === "file") URL.revokeObjectURL(it.previewUrl);
        });
      }
      return cur.filter((_, i) => i !== idx);
    });
  }
  function updateInfoSection(
    idx: number,
    key: "title" | "subtitle" | "content",
    value: string,
  ) {
    setInfoSections((cur) =>
      cur.map((s, i) => (i === idx ? { ...s, [key]: value } : s)),
    );
  }
  function moveInfoSection(idx: number, delta: number) {
    setInfoSections((cur) => {
      const next = [...cur];
      const t = idx + delta;
      if (t < 0 || t >= next.length) return cur;
      [next[idx], next[t]] = [next[t], next[idx]];
      return next;
    });
  }

  function addInfoImages(sectionIdx: number, fileList: FileList | null) {
    setInfoError(null);
    const files = Array.from(fileList ?? []);
    if (files.length === 0) return;
    setInfoSections((cur) => {
      const sec = cur[sectionIdx];
      if (!sec) return cur;
      const room = MAX_INFO_IMAGES_PER_SECTION - sec.images.length;
      if (room <= 0) {
        setInfoError(
          `이미지는 섹션당 최대 ${MAX_INFO_IMAGES_PER_SECTION}장까지 가능해요.`,
        );
        return cur;
      }
      const accepted: InfoImageItem[] = [];
      for (const f of files.slice(0, room)) {
        if (!ALLOWED_TYPE.test(f.type)) {
          setInfoError("JPG / PNG / WEBP / GIF 만 업로드 가능해요.");
          continue;
        }
        if (f.size > MAX_BYTES) {
          setInfoError("5MB 이하의 이미지를 올려주세요.");
          continue;
        }
        accepted.push({
          id: `info-file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          kind: "file",
          file: f,
          previewUrl: URL.createObjectURL(f),
        });
      }
      if (files.length > room) {
        setInfoError(
          `최대 ${MAX_INFO_IMAGES_PER_SECTION}장이라 ${room}개만 추가했어요.`,
        );
      }
      if (accepted.length === 0) return cur;
      return cur.map((s, i) =>
        i === sectionIdx ? { ...s, images: [...s.images, ...accepted] } : s,
      );
    });
  }
  function removeInfoImage(sectionIdx: number, imgIdx: number) {
    setInfoSections((cur) =>
      cur.map((s, i) => {
        if (i !== sectionIdx) return s;
        const target = s.images[imgIdx];
        if (target && target.kind === "file") {
          URL.revokeObjectURL(target.previewUrl);
        }
        return { ...s, images: s.images.filter((_, j) => j !== imgIdx) };
      }),
    );
  }
  function moveInfoImage(sectionIdx: number, imgIdx: number, delta: number) {
    setInfoSections((cur) =>
      cur.map((s, i) => {
        if (i !== sectionIdx) return s;
        const next = [...s.images];
        const t = imgIdx + delta;
        if (t < 0 || t >= next.length) return s;
        [next[imgIdx], next[t]] = [next[t], next[imgIdx]];
        return { ...s, images: next };
      }),
    );
  }

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
        action={formAction}
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

        {/* 서비스 카테고리 (멀티 셀렉트) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-bold">
              서비스 가능 카테고리{" "}
              <span className="text-slate font-medium ml-1">
                (앱 매장 카드/상세 상단 배지로 노출)
              </span>
            </span>
            <span className="text-[11px] text-slate">
              {services.length} 개 선택
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SELECTABLE_SERVICES.map((s) => {
              const active = services.includes(s.code);
              return (
                <button
                  key={s.code}
                  type="button"
                  onClick={() => toggleService(s.code)}
                  aria-pressed={active}
                  className={`h-10 px-4 rounded-full text-[13px] font-bold transition border ${
                    active
                      ? "bg-ink text-white border-ink"
                      : "bg-white text-graphite border-fog hover:border-ink hover:text-ink"
                  }`}
                >
                  {active && (
                    <span className="inline-block mr-1 align-middle">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ verticalAlign: "-2px" }}
                      >
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    </span>
                  )}
                  {s.label}
                </button>
              );
            })}
          </div>
          {/* 폼 제출 — 선택된 코드만 hidden input 으로 */}
          {services.map((c) => (
            <input key={c} type="hidden" name="services" value={c} />
          ))}
        </div>

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

        {/* 정보 섹션 — 앱 매장 상세 "정보" 탭에 노출 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-bold">
              정보 섹션{" "}
              <span className="text-slate font-medium ml-1">
                (앱 매장 상세 "정보" 탭에 노출 · 최대 {MAX_INFO_SECTIONS}개)
              </span>
            </span>
            <span className="text-[11px] text-slate">
              {infoSections.length} / {MAX_INFO_SECTIONS}
            </span>
          </div>
          <div className="text-[11px] text-slate mb-3 leading-[1.6]">
            매장 소식·이벤트·시술 안내 등을 주제 / 서브주제 / 본문 형태로 정리해서 보여줄 수 있어요.
          </div>

          {infoSections.length > 0 && (
            <ul className="flex flex-col gap-3 mb-3">
              {infoSections.map((s, i) => (
                <li
                  key={i}
                  className="rounded-[12px] border border-fog bg-paper p-3 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-brand-deep tracking-[0.05em]">
                      섹션 {i + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <SmallSquareBtn
                        disabled={i === 0}
                        onClick={() => moveInfoSection(i, -1)}
                        label="위로"
                      >
                        ↑
                      </SmallSquareBtn>
                      <SmallSquareBtn
                        disabled={i === infoSections.length - 1}
                        onClick={() => moveInfoSection(i, 1)}
                        label="아래로"
                      >
                        ↓
                      </SmallSquareBtn>
                      <SmallSquareBtn
                        danger
                        onClick={() => removeInfoSection(i)}
                        label="삭제"
                      >
                        ×
                      </SmallSquareBtn>
                    </div>
                  </div>
                  <input
                    type="text"
                    name="infoTitle"
                    value={s.title}
                    onChange={(e) =>
                      updateInfoSection(i, "title", e.target.value)
                    }
                    placeholder="주제 (예: 여름특가!! 유막제거 + 발수 코팅)"
                    className={`${inputCls} h-11`}
                  />
                  <input
                    type="text"
                    name="infoSubtitle"
                    value={s.subtitle}
                    onChange={(e) =>
                      updateInfoSection(i, "subtitle", e.target.value)
                    }
                    placeholder="서브 주제 (예: 여름·겨울 한 번씩 추천하는 시술)"
                    className={`${inputCls} h-11`}
                  />
                  <textarea
                    name="infoContent"
                    value={s.content}
                    onChange={(e) =>
                      updateInfoSection(i, "content", e.target.value)
                    }
                    rows={4}
                    placeholder={
                      "내용\n예) 중형차 기준 - 실내외세차(79,000) + 전체유막발수(150,000)\n   할인 - 실내외세차(79,000) + 전체유막발수(120,000)"
                    }
                    className={`${inputCls} h-auto py-3 resize-none leading-[1.6]`}
                  />

                  <InfoImagesEditor
                    section={s}
                    sectionIdx={i}
                    onAdd={(files) => addInfoImages(i, files)}
                    onRemove={(j) => removeInfoImage(i, j)}
                    onMove={(j, d) => moveInfoImage(i, j, d)}
                  />
                </li>
              ))}
            </ul>
          )}

          {infoError && (
            <div className="text-[12px] text-danger mb-2">{infoError}</div>
          )}

          {infoSections.length < MAX_INFO_SECTIONS && (
            <button
              type="button"
              onClick={addInfoSection}
              className="h-10 px-4 rounded-full border-[1.5px] border-dashed border-fog text-[12px] font-bold text-slate hover:border-brand-deep hover:text-brand-deep transition"
            >
              + 정보 섹션 추가
            </button>
          )}

          {/* 폼 제출 — 섹션별 이미지 메타·파일 직렬화 */}
          <InfoImagePayload sections={infoSections} />
        </div>

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

        <SaveButton />
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
          infoSections={infoSections}
          rating={defaults.rating}
          reviewCount={defaults.reviewCount}
          services={services}
        />
      </aside>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed left-1/2 -translate-x-1/2 bottom-8 z-[100] pointer-events-none"
        >
          <div
            className={`pointer-events-auto px-5 py-3 rounded-full shadow-[0_12px_36px_rgba(15,124,114,0.25)] flex items-center gap-2 text-[13px] font-bold ww-fade-up ${
              toast.kind === "ok"
                ? "bg-ink text-white"
                : "bg-danger text-white"
            }`}
          >
            <span
              className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
                toast.kind === "ok"
                  ? "bg-brand text-ink"
                  : "bg-white/20 text-white"
              }`}
            >
              {toast.kind === "ok" ? (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12l5 5L20 7" />
                </svg>
              ) : (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 6l12 12M6 18L18 6" />
                </svg>
              )}
            </span>
            <span>{toast.msg}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start h-11 px-6 rounded-full btn-brand text-[14px] disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
    >
      {pending && (
        <span className="inline-block w-3 h-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
      )}
      {pending ? "저장 중..." : "저장"}
    </button>
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

/**
 * 한 정보 섹션의 이미지 입력 UI.
 * 추가 / 삭제 / 순서변경 + 2열 그리드 미리보기.
 */
function InfoImagesEditor({
  section,
  sectionIdx,
  onAdd,
  onRemove,
  onMove,
}: {
  section: EditorInfoSection;
  sectionIdx: number;
  onAdd: (files: FileList | null) => void;
  onRemove: (idx: number) => void;
  onMove: (idx: number, delta: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const total = section.images.length;
  const room = MAX_INFO_IMAGES_PER_SECTION - total;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-bold text-graphite">
          이미지{" "}
          <span className="text-slate font-medium ml-1">
            (섹션당 최대 {MAX_INFO_IMAGES_PER_SECTION}장 · 5MB · JPG/PNG/WEBP)
          </span>
        </span>
        <span className="text-[10px] text-slate ww-num">
          {total} / {MAX_INFO_IMAGES_PER_SECTION}
        </span>
      </div>

      {total > 0 && (
        <ul className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2">
          {section.images.map((it, j) => {
            const url = it.kind === "url" ? it.url : it.previewUrl;
            return (
              <li
                key={it.id}
                className="relative group aspect-square rounded-[10px] overflow-hidden border border-fog bg-cloud"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <span className="absolute left-1.5 top-1.5 text-[9px] font-bold bg-ink text-white rounded-full px-[6px] py-[1px] ww-num">
                  {j + 1}
                </span>
                {it.kind === "file" && (
                  <span className="absolute right-1.5 top-1.5 text-[8px] font-bold bg-brand text-ink rounded-full px-[6px] py-[1px]">
                    NEW
                  </span>
                )}
                <div className="absolute left-1 right-1 bottom-1 flex gap-[2px] opacity-0 group-hover:opacity-100 transition">
                  <SmallBtn
                    disabled={j === 0}
                    onClick={() => onMove(j, -1)}
                    label="앞으로"
                  >
                    ←
                  </SmallBtn>
                  <SmallBtn
                    disabled={j === total - 1}
                    onClick={() => onMove(j, 1)}
                    label="뒤로"
                  >
                    →
                  </SmallBtn>
                  <SmallBtn danger onClick={() => onRemove(j)} label="삭제">
                    ×
                  </SmallBtn>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {room > 0 && (
        <>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => {
              onAdd(e.target.files);
              if (e.target) e.target.value = "";
            }}
            className="hidden"
            id={`info-img-input-${sectionIdx}`}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="h-9 px-3 rounded-full border-[1.5px] border-dashed border-fog text-[11px] font-bold text-slate hover:border-brand-deep hover:text-brand-deep transition"
          >
            + 이미지 추가
          </button>
        </>
      )}
    </div>
  );
}

/**
 * 정보 섹션 이미지를 폼 제출용 hidden input 으로 직렬화.
 * 평행 배열: infoImageSectionIdx + infoImageKind ↔ infoImageUrl/infoImageFile
 */
function InfoImagePayload({ sections }: { sections: EditorInfoSection[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";
    sections.forEach((sec, sectionIdx) => {
      sec.images.forEach((img) => {
        const idxInput = document.createElement("input");
        idxInput.type = "hidden";
        idxInput.name = "infoImageSectionIdx";
        idxInput.value = String(sectionIdx);
        containerRef.current!.appendChild(idxInput);

        const kindInput = document.createElement("input");
        kindInput.type = "hidden";
        kindInput.name = "infoImageKind";
        kindInput.value = img.kind;
        containerRef.current!.appendChild(kindInput);

        if (img.kind === "url") {
          const u = document.createElement("input");
          u.type = "hidden";
          u.name = "infoImageUrl";
          u.value = img.url;
          containerRef.current!.appendChild(u);
        } else if (img.kind === "file") {
          const fi = document.createElement("input");
          fi.type = "file";
          fi.name = "infoImageFile";
          fi.style.display = "none";
          try {
            const dt = new DataTransfer();
            dt.items.add(img.file);
            fi.files = dt.files;
            containerRef.current!.appendChild(fi);
          } catch {
            // 미지원 브라우저 — 무시
          }
        }
      });
    });
  }, [sections]);

  return <div ref={containerRef} className="hidden" />;
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
      className={`w-7 h-7 rounded-[8px] text-[14px] font-bold transition disabled:opacity-30 ${
        danger
          ? "bg-danger/10 text-danger hover:bg-danger/20"
          : "bg-white border border-fog text-ink hover:border-brand-deep hover:text-brand-deep"
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
  infoSections,
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
  infoSections: EditorInfoSection[];
  rating: number;
  reviewCount: number;
  services: string[];
}) {
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState<"products" | "info" | "reviews">(
    "info",
  );
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
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
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
              <div className="flex flex-wrap gap-1 mb-2">
                {labels.map((t) => (
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

        <div className="bg-white px-4 pt-3 pb-5 min-h-[260px]">
          {/* ★ rating · 거리 + 즐겨찾기/공유 (실제 앱과 동일) */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-[6px] text-[11px]">
              <span className="text-ink">★</span>
              <span className="font-bold">{rating.toFixed(1)}</span>
              <span className="text-slate">({reviewCount})</span>
              <span className="text-ash">·</span>
              <span className="text-slate">0.4km</span>
            </div>
            <div className="flex items-center gap-1 text-ink pointer-events-none">
              {/* 즐겨찾기 */}
              <span className="w-7 h-7 inline-flex items-center justify-center">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z" />
                </svg>
              </span>
              {/* 공유 */}
              <span className="w-7 h-7 inline-flex items-center justify-center">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </span>
            </div>
          </div>

          {/* 주소·전화·영업시간 + 우측 길찾기 버튼 (실제 앱과 동일) */}
          <div className="mt-2 flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0 flex flex-col gap-[3px]">
              {/* 📍 주소 */}
              <div className="flex items-center gap-1 text-[11px] text-slate">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s-7-7.5-7-13a7 7 0 0114 0c0 5.5-7 13-7 13z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                <span className="truncate">{address}</span>
              </div>

              {/* 📞 전화 */}
              {phone && (
                <div className="flex items-center gap-1 text-[11px] text-slate ww-num underline underline-offset-[3px] decoration-from-font">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0122 16.92z" />
                  </svg>
                  {phone}
                </div>
              )}

              {/* 🕒 영업시간 */}
              <div className="flex items-center gap-1 text-[11px] text-slate">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                <span className="truncate">
                  오늘 10:00 — 22:00 (쉬는 시간 13:00 — 14:00)
                </span>
              </div>
            </div>

            {/* 길찾기 버튼 mock */}
            <div className="shrink-0 w-[52px] h-[52px] rounded-[10px] border border-fog bg-white flex flex-col items-center justify-center gap-[2px] pointer-events-none">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-brand-deep"
              >
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              <span className="text-[9px] font-bold text-ink">길찾기</span>
            </div>
          </div>

          {/* 매장 안내 (홍보 문구) */}
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

          {/* 탭 */}
          <div className="grid grid-cols-3 mt-4 border-t border-fog">
            {([
              { key: "products", label: "상품" },
              { key: "info", label: "정보" },
              { key: "reviews", label: "리뷰" },
            ] as const).map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={`py-2 text-center text-[11px] font-bold transition ${
                  activeTab === t.key
                    ? "text-ink border-b-2 border-ink"
                    : "text-slate hover:text-graphite"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === "products" && (
            <div className="mt-3">
              <div className="rounded-[12px] border border-fog p-2 flex gap-2">
                <div className="w-[64px] h-[64px] rounded-[10px] bg-gradient-to-br from-cloud to-fog shrink-0" />
                <div className="flex-1 min-w-0 py-[2px]">
                  <div className="text-[9px] text-slate font-medium">
                    60분 소요
                  </div>
                  <div className="text-[12px] font-extrabold tracking-[-0.2px]">
                    기본(베이직) 디테일링
                  </div>
                  <div className="text-[10px] text-slate truncate">
                    외부 손세차 + 실내 청소
                  </div>
                  <div className="text-[12px] font-extrabold ww-num mt-[2px]">
                    55,000원
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "info" && (
            <div className="mt-3 flex flex-col gap-3">
              {infoSections.length === 0 ? (
                <div className="rounded-[10px] border border-dashed border-fog p-4 text-center text-[11px] text-slate leading-[1.6]">
                  좌측에서 정보 섹션을 추가하면 여기에 표시돼요.
                </div>
              ) : (
                infoSections.map((s, i) => {
                  const urls = s.images
                    .map((it) => (it.kind === "url" ? it.url : it.previewUrl))
                    .filter(Boolean);
                  return (
                    <div
                      key={i}
                      className="rounded-[10px] border border-fog bg-white p-3"
                    >
                      {s.title && (
                        <div className="text-[12px] font-extrabold tracking-[-0.2px] text-ink leading-[1.4]">
                          {s.title}
                        </div>
                      )}
                      {s.subtitle && (
                        <div className="text-[11px] font-bold text-graphite mt-[3px] leading-[1.4]">
                          {s.subtitle}
                        </div>
                      )}
                      {s.content && (
                        <div className="text-[11px] text-slate leading-[1.6] mt-2 whitespace-pre-wrap">
                          {s.content}
                        </div>
                      )}
                      {urls.length > 0 && (
                        <div className="grid grid-cols-2 gap-1 mt-2">
                          {urls.map((u, j) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={j}
                              src={u}
                              alt=""
                              className="aspect-square w-full object-cover rounded-[8px] bg-cloud"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="mt-3 rounded-[10px] border border-dashed border-fog p-4 text-center text-[11px] text-slate">
              아직 등록된 리뷰가 없어요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
