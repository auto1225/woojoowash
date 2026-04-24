import * as React from "react";
import { BottomTabBar } from "@/components/app/BottomTabBar";
import { TabsHeader } from "@/components/app/TabsHeader";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      <TabsHeader />
      <main className="flex-1 overflow-y-auto ww-no-scrollbar overscroll-contain">
        {children}
      </main>
      <BottomTabBar />
    </div>
  );
}
