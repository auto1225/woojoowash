"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleFavorite } from "./actions";

export function StoreActions({
  storeId,
  storeName,
  initialFavorited,
}: {
  storeId: string;
  storeName: string;
  initialFavorited: boolean;
}) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1600);
  }

  function onFavorite() {
    startTransition(async () => {
      const r = await toggleFavorite(storeId);
      if (!r.ok) {
        if (r.needLogin) {
          router.push(
            `/app/login?callbackUrl=${encodeURIComponent(`/app/stores/${storeId}`)}`,
          );
        } else {
          flash(r.error);
        }
        return;
      }
      setFavorited(r.favorited);
      flash(r.favorited ? "즐겨찾기에 추가했어요" : "즐겨찾기에서 뺐어요");
    });
  }

  async function onShare() {
    const url =
      typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: storeName,
      text: `${storeName} - 우주워시에서 예약하세요`,
      url,
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      // 사용자 취소 등은 무시
      return;
    }
    // Fallback: clipboard
    try {
      await navigator.clipboard.writeText(url);
      flash("링크를 복사했어요");
    } catch {
      flash("공유에 실패했어요");
    }
  }

  return (
    <div className="relative flex items-center gap-2">
      <IconBtn
        ariaLabel={favorited ? "즐겨찾기 해제" : "즐겨찾기 추가"}
        onClick={onFavorite}
        disabled={pending}
        active={favorited}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={favorited ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z" />
        </svg>
      </IconBtn>

      <IconBtn ariaLabel="공유하기" onClick={onShare}>
        <svg
          width="20"
          height="20"
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
      </IconBtn>

      {toast && (
        <div className="absolute right-0 top-full mt-2 px-3 py-2 rounded-[10px] bg-ink text-white text-[12px] font-semibold shadow-ww-pop whitespace-nowrap z-30">
          {toast}
        </div>
      )}
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
  active,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`w-10 h-10 rounded-full border flex items-center justify-center transition active:scale-[0.94] ${
        active
          ? "bg-danger/10 border-danger text-danger"
          : "bg-white border-fog text-ink hover:bg-cloud"
      } disabled:opacity-50`}
    >
      {children}
    </button>
  );
}
