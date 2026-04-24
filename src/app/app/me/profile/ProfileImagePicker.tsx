"use client";

import { useRef, useState } from "react";

export function ProfileImagePicker({
  currentImage,
  fallbackLetter,
}: {
  currentImage: string | null;
  fallbackLetter?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImage);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setError("3MB 이하의 이미지를 선택해 주세요.");
      e.target.value = "";
      return;
    }
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
      setError("JPG / PNG / WEBP / GIF 형식만 가능해요.");
      e.target.value = "";
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setRemoving(false);
  }

  function clearSelection() {
    if (fileRef.current) fileRef.current.value = "";
    setPreview(null);
    setRemoving(true);
  }

  return (
    <div className="bg-white rounded-[14px] border border-fog p-5 flex items-center gap-4">
      <div className="relative w-[76px] h-[76px] rounded-full overflow-hidden bg-cloud flex items-center justify-center shrink-0">
        {preview ? (
          // 로컬 프리뷰(blob:)는 외부 도메인이 아니므로 <img> 사용
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="프로필 미리보기"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[26px] font-extrabold text-slate">
            {fallbackLetter ?? "?"}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-bold mb-2">프로필 사진</div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="h-9 px-3 rounded-full bg-ink text-white text-[12px] font-bold"
          >
            {preview ? "다시 선택" : "사진 올리기"}
          </button>
          {(preview || currentImage) && (
            <button
              type="button"
              onClick={clearSelection}
              className="h-9 px-3 rounded-full border border-fog text-slate text-[12px] font-semibold"
            >
              삭제
            </button>
          )}
        </div>
        <div className="text-[11px] text-slate mt-2 leading-[1.5]">
          JPG / PNG / WEBP · 3MB 이하
        </div>
        {error && (
          <div className="text-[11px] text-danger mt-1">{error}</div>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        name="image"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={onPick}
      />
      <input
        type="checkbox"
        name="removeImage"
        checked={removing}
        readOnly
        className="hidden"
      />
    </div>
  );
}
