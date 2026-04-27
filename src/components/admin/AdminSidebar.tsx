"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { WWLogo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

type Item = { label: string; href: string };
type Group = {
  id: string;
  label: string;
  items: Item[];
  // 이 그룹을 숨길 조건 (flags 기반)
  hideIfDisabled?: "shop" | "community";
};

const GROUPS: Group[] = [
  {
    id: "home",
    label: "대시보드",
    items: [
      { label: "종합 대시보드", href: "/admin" },
      { label: "방문자 통계", href: "/admin/analytics" },
      { label: "매출", href: "/admin/revenue" },
    ],
  },
  {
    id: "biz",
    label: "비즈니스",
    items: [
      { label: "회원 관리", href: "/admin/users" },
      { label: "매장 관리", href: "/admin/stores" },
      { label: "제휴 문의", href: "/admin/inquiries" },
    ],
  },
  {
    id: "landing",
    label: "랜딩 페이지",
    items: [{ label: "Hero 슬라이드", href: "/admin/content/hero" }],
  },
  {
    id: "shop",
    label: "쇼핑",
    hideIfDisabled: "shop",
    items: [
      { label: "상품 관리", href: "/admin/shop/products" },
      { label: "주문 관리", href: "/admin/shop/orders" },
      { label: "배송 관리", href: "/admin/shop/shipments" },
    ],
  },
  {
    id: "community",
    label: "커뮤니티",
    hideIfDisabled: "community",
    items: [
      { label: "공지사항", href: "/admin/notices" },
      { label: "FAQ 관리", href: "/admin/faqs" },
      { label: "1:1 문의", href: "/admin/support" },
      { label: "게시판", href: "/admin/posts" },
    ],
  },
  {
    id: "settings",
    label: "설정",
    items: [
      { label: "사이트 설정", href: "/admin/settings" },
      { label: "약관·정책 관리", href: "/admin/legal" },
    ],
  },
];

export function AdminSidebar({
  flags,
}: {
  flags: { shopEnabled: boolean; communityEnabled: boolean };
}) {
  const pathname = usePathname() || "";

  const visibleGroups = GROUPS.filter((g) => {
    if (g.hideIfDisabled === "shop" && !flags.shopEnabled) return false;
    if (g.hideIfDisabled === "community" && !flags.communityEnabled) return false;
    return true;
  });

  const activeGroup =
    visibleGroups.find((g) => g.items.some((i) => pathname === i.href))?.id ??
    "home";
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(visibleGroups.map((g) => [g.id, true])),
  );

  function toggle(id: string) {
    setOpen((s) => ({ ...s, [id]: !s[id] }));
  }

  return (
    <aside className="w-[240px] shrink-0 bg-white border-r border-fog flex flex-col">
      <div className="relative h-[56px] flex items-center gap-2 px-5 border-b border-fog">
        <WWLogo size={16} compact />
        <span
          className="text-[10px] font-extrabold text-ink rounded-full px-[10px] py-[3px] tracking-wide"
          style={{ background: "var(--ww-brand-grad)" }}
        >
          ADMIN
        </span>
        <span
          className="absolute left-0 right-0 bottom-0 h-[2px]"
          style={{ background: "var(--ww-brand-grad)" }}
        />
      </div>

      <nav className="flex-1 overflow-y-auto ww-no-scrollbar py-2">
        {visibleGroups.map((g) => {
          const isOpen = open[g.id] ?? true;
          return (
            <div key={g.id} className="px-2 mt-1">
              <button
                type="button"
                onClick={() => toggle(g.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-[11px] rounded-[8px] text-[15px] font-extrabold tracking-[-0.2px]",
                  activeGroup === g.id ? "text-ink" : "text-graphite",
                )}
              >
                <span>{g.label}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  className={cn(
                    "transition-transform",
                    isOpen ? "rotate-0" : "-rotate-90",
                  )}
                >
                  <path
                    d="M3 4.5l3 3 3-3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {isOpen && (
                <ul className="flex flex-col gap-[2px] pb-2">
                  {g.items.map((it) => {
                    const active = pathname === it.href;
                    return (
                      <li key={it.href}>
                        <Link
                          href={it.href}
                          className={cn(
                            "flex items-center px-3 py-[9px] rounded-[8px] text-[13px] font-medium transition",
                            active
                              ? "bg-brand-bg text-brand-deep font-bold"
                              : "text-graphite hover:bg-cloud",
                          )}
                        >
                          {active && (
                            <span className="w-[3px] h-4 bg-brand rounded-full mr-2 -ml-[2px]" />
                          )}
                          {it.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-fog p-3">
        <Link
          href="/home"
          className="flex items-center gap-2 px-3 py-2 text-[12px] font-semibold text-slate hover:text-ink"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          사이트로 돌아가기
        </Link>
      </div>
    </aside>
  );
}
