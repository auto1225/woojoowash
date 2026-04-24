import * as React from "react";
import { BottomTabBar } from "@/components/app/BottomTabBar";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="pb-[80px]">{children}</div>
      <BottomTabBar />
    </>
  );
}
