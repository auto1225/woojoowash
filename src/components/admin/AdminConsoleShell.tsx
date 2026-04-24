import * as React from "react";
import Link from "next/link";
import { signOut } from "@/auth";
import { WWLogo } from "@/components/brand/Logo";

type TabKey = "dashboard" | "users" | "stores" | "inquiries" | "revenue";

const TABS: Array<{ key: TabKey; label: string; href: string }> = [
  { key: "dashboard", label: "대시보드", href: "/admin" },
  { key: "users", label: "회원", href: "/admin/users" },
  { key: "stores", label: "매장", href: "/admin/stores" },
  { key: "inquiries", label: "제휴 문의", href: "/admin/inquiries" },
  { key: "revenue", label: "매출", href: "/admin/revenue" },
];

export function AdminConsoleShell({
  children,
  active,
  userName,
}: {
  children: React.ReactNode;
  active: TabKey;
  userName?: string | null;
}) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-20 bg-white border-b border-fog">
        <div className="mx-auto max-w-[1280px] px-6 h-[64px] flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <WWLogo size={18} compact />
            <span className="text-[11px] font-bold text-white bg-ink rounded-full px-2 py-[3px]">
              ADMIN
            </span>
          </Link>
          <div className="flex items-center gap-5 text-[13px]">
            {userName && <span className="text-slate">{userName}</span>}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button
                type="submit"
                className="text-[13px] font-semibold text-slate hover:text-ink"
              >
                로그아웃
              </button>
            </form>
          </div>
        </div>
        <nav className="mx-auto max-w-[1280px] px-6 flex gap-6 text-[13px] font-semibold h-12 items-center border-t border-fog">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={t.href}
              className={
                active === t.key
                  ? "text-ink border-b-2 border-ink h-12 flex items-center"
                  : "text-slate hover:text-ink"
              }
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-[1280px] px-6 py-10">{children}</main>
    </div>
  );
}
