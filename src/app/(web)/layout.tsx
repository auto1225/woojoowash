import * as React from "react";
import { WebNav } from "@/components/web/WebNav";
import { WebFooter } from "@/components/web/WebFooter";

export default function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-ink">
      <WebNav />
      <main className="pt-[72px]">{children}</main>
      <WebFooter />
    </div>
  );
}
