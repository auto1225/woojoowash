import * as React from "react";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  className,
  withTabBar = true,
}: {
  children: React.ReactNode;
  className?: string;
  withTabBar?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-app min-h-screen bg-white",
        className,
      )}
      style={{
        paddingBottom: withTabBar ? 0 : undefined,
      }}
    >
      {children}
    </div>
  );
}
