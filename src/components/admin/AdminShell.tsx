import * as React from "react";
import Link from "next/link";
import { signOut } from "@/auth";
import { WWLogo } from "@/components/brand/Logo";

export function AdminShell({
  children,
  storeName,
  userName,
  storeId,
}: {
  children: React.ReactNode;
  storeName?: string;
  userName?: string | null;
  storeId?: string;
}) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-20 bg-white border-b border-fog">
        <div className="mx-auto max-w-[1240px] px-6 h-[64px] flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <WWLogo size={18} compact />
            <span className="text-[11px] font-bold text-slate bg-cloud rounded-full px-2 py-[2px]">
              CMS
            </span>
          </Link>
          <div className="flex items-center gap-5 text-[13px]">
            {storeName && (
              <span className="text-slate">
                <span className="font-semibold text-ink">{storeName}</span>
              </span>
            )}
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
        {storeId && (
          <nav className="mx-auto max-w-[1240px] px-6 flex gap-6 text-[13px] font-semibold h-12 items-center border-t border-fog">
            <Link href={`/admin/stores/${storeId}`} className="hover:text-accent">
              대시보드
            </Link>
            <Link
              href={`/admin/stores/${storeId}/profile`}
              className="hover:text-accent"
            >
              매장 정보
            </Link>
            <Link
              href={`/admin/stores/${storeId}/products`}
              className="hover:text-accent"
            >
              상품·가격
            </Link>
            <Link
              href={`/admin/stores/${storeId}/schedule`}
              className="hover:text-accent"
            >
              영업시간·휴무
            </Link>
            <Link
              href={`/admin/stores/${storeId}/reservations`}
              className="hover:text-accent"
            >
              예약 관리
            </Link>
          </nav>
        )}
      </header>
      <main className="mx-auto max-w-[1240px] px-6 py-10">{children}</main>
    </div>
  );
}
