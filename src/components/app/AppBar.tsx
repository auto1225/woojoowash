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
        "h-[52px] flex items-center justify-between px-4 shrink-0",
        dark ? "bg-transparent text-white" : "bg-white text-ink",
        border && "border-b border-fog",
      )}
    >
      <div className="w-10 flex items-center">
        {showBack && (
          <button
            type="button"
            onClick={back}
            className="p-0 bg-transparent"
            aria-label="뒤로"
          >
            <IconBack size={24} stroke={2} />
          </button>
        )}
      </div>
      <div className="text-[17px] font-semibold tracking-[-0.3px]">
        {title}
      </div>
      <div className="w-10 flex justify-end">{right}</div>
    </div>
  );
}
