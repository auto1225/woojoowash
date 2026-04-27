import * as React from "react";
import { AppShell } from "@/components/app/AppShell";
import { InactivityTracker } from "@/components/app/InactivityTracker";
import { SessionRestorer } from "@/components/app/SessionRestorer";

export default function AppRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell withTabBar={false}>
      {/* 진입 시 silent refresh + 30 분 무활동 자동 로그아웃 */}
      <SessionRestorer />
      <InactivityTracker />
      {children}
    </AppShell>
  );
}
