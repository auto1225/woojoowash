"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { IconBack } from "@/components/icons";
import { cn } from "@/lib/utils";

export function AppBar({
  title,
  showBack = true,
  right,
  dark = false,
  border = true,
  onBack,
}: {
  title?: string;
  showBack?: boolean;
  right?: React.ReactNode;
  dark?: boolean;
  border?: boolean;
  onBack?: () => void;
}) {
  const router = useRouter();
  const back = () => (onBack ? onBack() : router.back());
  return (
    <div
      className={cn(
        "h-[52px] flex items-center justify-between px-3 shrink-0",
        // 일반 모드는 sticky 로 상단 고정, dark 모드(히어로 오버레이) 는 기존 relative 유지
        dark
          ? "relative z-20 bg-transparent text-white"
          : "sticky top-0 z-30 bg-white text-ink",
        border && "border-b border-fog",
      )}
    >
      <div className="w-11 flex items-center">
        {showBack && (
          <button
            type="button"
            onClick={back}
            aria-label="뒤로"
            className={cn(
              "inline-flex items-center justify-center w-10 h-10 rounded-full transition active:scale-[0.94]",
              dark
                ? "bg-black/30 text-white ww-backdrop-glass"
                : "bg-transparent text-ink hover:bg-cloud",
            )}
          >
            <IconBack size={22} stroke={2.2} />
          </button>
        )}
      </div>
      <div className="text-[17px] font-semibold tracking-[-0.3px] truncate max-w-[60%] text-center">
        {title}
      </div>
      <div className="w-11 flex justify-end">
        {right && (
          <div
            className={cn(
              "inline-flex items-center justify-center min-w-[40px] h-10 rounded-full",
              dark ? "bg-black/30 ww-backdrop-glass px-2" : "",
            )}
          >
            {right}
          </div>
        )}
      </div>
    </div>
  );
}
