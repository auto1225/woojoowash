import * as React from "react";
import { signOut } from "@/auth";
import { AdminSidebar } from "./AdminSidebar";
import { getFlags } from "@/lib/settings";

export async function AdminConsoleShell({
  children,
  title,
  subtitle,
  userName,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  userName?: string | null;
}) {
  const flags = await getFlags();

  return (
    <div className="min-h-screen h-screen flex bg-paper">
      <AdminSidebar flags={flags} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[56px] shrink-0 bg-white border-b border-fog flex items-center justify-end gap-5 px-6">
          {userName && (
            <span className="text-[13px] text-slate">{userName}</span>
          )}
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
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto px-8 py-8">
            {(title || subtitle) && (
              <div className="mb-7">
                {title && (
                  <h1 className="ww-disp text-[28px] tracking-[-0.02em]">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-slate text-[13px] mt-1">{subtitle}</p>
                )}
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
