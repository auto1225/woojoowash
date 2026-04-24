"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { WWLogo } from "@/components/brand/Logo";
import { IconMenu } from "@/components/icons";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "서비스", href: "/home#services" },
  { label: "매장 찾기", href: "/stores" },
  { label: "할인패스", href: "/pass" },
  { label: "제휴·입점", href: "/partners" },
  { label: "고객센터", href: "/support" },
];

export function WebNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 ww-backdrop-glass border-b border-fog"
          : "bg-white/0 border-b border-transparent",
      )}
    >
      <div className="mx-auto max-w-site px-5 md:px-10 h-[72px] flex items-center justify-between">
        <Link href="/home" className="flex items-center">
          <WWLogo size={20} />
        </Link>
        <nav className="hidden md:flex items-center gap-10 text-[14px] font-semibold text-graphite">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-ink transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/app/login"
            className="hidden sm:inline-flex h-10 items-center px-4 rounded-full text-[13px] font-semibold text-graphite hover:text-ink transition"
          >
            로그인
          </Link>
          <Link
            href="/download"
            className="inline-flex h-10 items-center px-5 rounded-full bg-ink text-white text-[13px] font-bold shadow-ww-btn hover:bg-accent-deep transition-colors"
          >
            앱 다운로드
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden w-10 h-10 rounded-full border border-fog flex items-center justify-center"
            aria-label="menu"
          >
            <IconMenu size={20} stroke={1.8} />
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-fog bg-white">
          <div className="px-5 py-3 flex flex-col">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 text-[15px] font-semibold"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
