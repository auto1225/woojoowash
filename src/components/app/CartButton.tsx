"use client";

import Link from "next/link";
import { useCartCount } from "@/lib/cart";
import { useEffect, useState } from "react";

export function CartButton({ dark }: { dark?: boolean }) {
  const count = useCartCount();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Link
      href="/app/market/cart"
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full ${
        dark ? "bg-black/30 text-white ww-backdrop-glass" : ""
      }`}
      aria-label="장바구니"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 6h15l-1.5 9h-12z" />
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="17" cy="20" r="1.5" />
        <path d="M6 6 L4 3 H2" />
      </svg>
      {mounted && count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-[5px] rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}
