import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-white border border-fog",
        "rounded-[16px]",
        padded && "p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionGap({ size = 12 }: { size?: number }) {
  return <div className="bg-cloud" style={{ height: size }} />;
}
