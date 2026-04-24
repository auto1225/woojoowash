"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHome,
  IconHomeFill,
  IconHeart,
  IconHeartFill,
  IconCal,
  IconCalFill,
  IconUser,
  IconUserFill,
} from "@/components/icons";
import { cn } from "@/lib/utils";

type TabId = "home" | "fav" | "res" | "me";

const TABS: {
  id: TabId;
  label: string;
  href: string;
  Icon: React.FC<any>;
  IconFill: React.FC<any>;
  match: (p: string) => boolean;
}[] = [
  {
    id: "home",
    label: "홈",
    href: "/app",
    Icon: IconHome,
    IconFill: IconHomeFill,
    match: (p) => p === "/app" || p === "/app/",
  },
  {
    id: "fav",
    label: "즐겨찾기",
    href: "/app/favorites",
    Icon: IconHeart,
    IconFill: IconHeartFill,
    match: (p) => p.startsWith("/app/favorites"),
  },
  {
    id: "res",
    label: "나의 예약",
    href: "/app/reservations",
    Icon: IconCal,
    IconFill: IconCalFill,
    match: (p) => p.startsWith("/app/reservations"),
  },
  {
    id: "me",
    label: "내 정보",
    href: "/app/me",
    Icon: IconUser,
    IconFill: IconUserFill,
    match: (p) => p.startsWith("/app/me"),
  },
];

export function BottomTabBar() {
  const pathname = usePathname() || "";
  return (
    <nav
      className="shrink-0 bg-white border-t border-fog z-40"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex pt-[10px] pb-[8px]">
        {TABS.map((t) => {
          const active = t.match(pathname);
          const I = active ? t.IconFill : t.Icon;
          return (
            <Link
              key={t.id}
              href={t.href}
              className={cn(
                "flex-1 flex flex-col items-center gap-1",
                active ? "text-ink" : "text-ash",
              )}
            >
              <I size={24} stroke={1.8} />
              <span className="text-[11px] font-semibold tracking-[-0.2px]">
                {t.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
