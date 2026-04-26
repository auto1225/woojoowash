"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import {
  INITIAL_SAVE_STATE,
  SaveButton,
  SaveToast,
  type SaveActionState,
} from "@/components/admin/SaveToast";

const MAX_PHOTOS = 5;
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPE = /^image\/(jpeg|png|webp|gif)$/;

type PhotoItem = {
  id: string;
  file: File;
  previewUrl: string;
};

export function ReviewForm({
  action,
  cancelHref,
}: {
  action: (
    prev: SaveActionState,
    formData: FormData,
  ) => Promise<SaveActionState>;
  cancelHref: string;
}) {
  const [rating, setRating] = useState<number>(5);
  const [hover, setHover] = useState<number | null>(null);
  const [body, setBody] = useState<string>("");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saveState, formAction] = useFormState(action, INITIAL_SAVE_STATE);

  useEffect(() => {
    return () => {
      photos.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const files = Array.from(e.target.files ?? []);
    if (e.target) e.target.value = "";
    if (files.length === 0) return;
    const room = MAX_PHOTOS - photos.length;
    if (room <= 0) {
      setError(`사진은 최대 ${MAX_PHOTOS}장까지 가능해요.`);
      return;
    }
    const accepted: PhotoItem[] = [];
    for (const f of files.slice(0, room)) {
      if (!ALLOWED_TYPE.test(f.type)) {
        setError("JPG / PNG / WEBP / GIF 만 업로드 가능해요.");
        continue;
      }
      if (f.size > MAX_BYTES) {
        setError("5MB 이하의 사진을 올려주세요.");
        continue;
      }
      accepted.push({
        id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        file: f,
        previewUrl: URL.createObjectURL(f),
      });
    }
    if (files.length > room) {
      setError(`최대 ${MAX_PHOTOS}장이라 ${room}개만 추가했어요.`);
    }
    if (accepted.length > 0) setPhotos((cur) => [...cur, ...accepted]);
  }

  function removePhoto(idx: number) {
    setPhotos((cur) => {
      const target = cur[idx];
      if (target) URL.revokeObjectURL(target.previewUrl);
      return cur.filter((_, i) => i !== idx);
    });
  }

  return (
    <form action={formAction} className="px-5 pb-[120px] flex flex-col gap-6">
      {/* 별점 */}
      <section>
        <div className="text-[14px] font-bold mb-3">별점을 선택해주세요</div>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => {
            const filled = (hover ?? rating) >= n;
            return (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setRating(n)}
                aria-label={`${n}점`}
                className="p-1 active:scale-95 transition"
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill={filled ? "#FFB400" : "#E5E5EA"}
                >
                  <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8l-5.8 3.1 1.1-6.5L2.6 9.8l6.5-.9L12 3z" />
                </svg>
              </button>
            );
          })}
          <span className="ml-3 ww-num font-extrabold text-[18px]">
            {rating}.0
          </span>
        </div>
        <input type="hidden" name="rating" value={rating} />
      </section>

      {/* 본문 */}
      <section>
        <label htmlFor="body" className="text-[14px] font-bold mb-3 block">
          어떠셨나요?
        </label>
        <textarea
          id="body"
          name="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          maxLength={1000}
          placeholder="다른 고객분들께 도움이 되도록 솔직한 후기를 남겨주세요."
          className="w-full p-4 bg-paper border border-fog rounded-[14px] text-[14px] outline-none focus:border-ink resize-none leading-[1.6]"
        />
        <div className="text-right text-[11px] text-slate ww-num mt-1">
          {body.length} / 1000
        </div>
      </section>

      {/* 사진 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[14px] font-bold">사진 첨부 (선택)</span>
          <span className="text-[11px] text-slate ww-num">
            {photos.length} / {MAX_PHOTOS}
          </span>
        </div>
        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {photos.map((p, i) => (
              <div
                key={p.id}
                className="relative aspect-square rounded-[10px] overflow-hidden bg-cloud border border-fog"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.previewUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  aria-label="사진 삭제"
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-ink/80 text-white text-[14px] inline-flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {photos.length < MAX_PHOTOS && (
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
              className="h-12 w-full rounded-[12px] border-[1.5px] border-dashed border-fog text-[13px] font-bold text-slate hover:border-ink hover:text-ink transition inline-flex items-center justify-center gap-2"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 8a2 2 0 012-2h2l2-2h6l2 2h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              사진 추가
            </button>
          </>
        )}
        {error && (
          <div className="text-[12px] text-danger mt-2">{error}</div>
        )}

        {/* 파일 inputs (DataTransfer 로 폼 첨부) */}
        <PhotoPayloadFields photos={photos} />
      </section>

      {/* 하단 고정 액션 */}
      <div className="fixed left-0 right-0 bottom-0 z-30 flex justify-center">
        <div className="w-full max-w-app bg-white border-t border-fog px-4 py-3 flex gap-2">
          <a
            href={cancelHref}
            className="h-12 px-5 rounded-full border border-fog text-graphite text-[13px] font-bold inline-flex items-center"
          >
            취소
          </a>
          <SaveButton
            label="리뷰 등록"
            pendingLabel="등록 중..."
            className="flex-1 h-12 rounded-full bg-ink text-white font-bold text-[14px] disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          />
        </div>
      </div>
      <SaveToast state={saveState} successMessage="리뷰를 등록했어요" />
    </form>
  );
}

function PhotoPayloadFields({ photos }: { photos: PhotoItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";
    photos.forEach((p) => {
      const input = document.createElement("input");
      input.type = "file";
      input.name = "photo";
      input.style.display = "none";
      try {
        const dt = new DataTransfer();
        dt.items.add(p.file);
        input.files = dt.files;
        containerRef.current!.appendChild(input);
      } catch {
        // unsupported
      }
    });
  }, [photos]);
  return <div ref={containerRef} className="hidden" />;
}
