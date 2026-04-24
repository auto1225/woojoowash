import * as React from "react";
import { AppShell } from "@/components/app/AppShell";

export default function AppRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell withTabBar={false}>{children}</AppShell>;
}
