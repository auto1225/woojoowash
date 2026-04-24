import * as React from "react";
import { cn } from "@/lib/utils";

export function Chip({
  children,
  active = false,
  size = "md",
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sz =
    size === "sm"
      ? "px-3 py-[6px] text-[12px]"
      : size === "lg"
        ? "px-5 py-[14px] text-[15px]"
        : "px-4 py-[10px] text-[14px]";
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full whitespace-nowrap border tracking-[-0.3px]",
        active
          ? "bg-ink text-white border-ink font-semibold"
          : "bg-white text-graphite border-fog font-medium",
        sz,
        className,
      )}
    >
      {children}
    </span>
  );
}

export function CircleChip({
  children,
  active = false,
  disabled = false,
  ring = false,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  ring?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full shrink-0",
        "min-w-[58px] h-[58px] px-[14px] text-[14px] tracking-[-0.3px]",
        active
          ? "bg-ink text-white font-bold border border-ink"
          : ring
            ? "bg-white text-ink border-[1.5px] border-ink font-medium"
            : "bg-white text-ink border border-fog font-medium",
        disabled && "text-ash",
      )}
    >
      {children}
    </span>
  );
}
