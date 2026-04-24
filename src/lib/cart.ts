"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

const KEY = "ww_cart_v1";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("ww-cart-change"));
}

const subscribers = new Set<() => void>();

function subscribe(cb: () => void) {
  subscribers.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  const onCustom = () => cb();
  window.addEventListener("storage", onStorage);
  window.addEventListener("ww-cart-change", onCustom);
  return () => {
    subscribers.delete(cb);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("ww-cart-change", onCustom);
  };
}

export function useCart() {
  const items = useSyncExternalStore(
    subscribe,
    () => JSON.stringify(read()),
    () => "[]",
  );
  const parsed: CartItem[] = JSON.parse(items);

  const add = useCallback(
    (item: Omit<CartItem, "quantity">, qty = 1) => {
      const cur = read();
      const i = cur.findIndex((x) => x.productId === item.productId);
      if (i >= 0) {
        cur[i].quantity += qty;
      } else {
        cur.push({ ...item, quantity: qty });
      }
      write(cur);
    },
    [],
  );

  const setQty = useCallback((productId: string, qty: number) => {
    const cur = read();
    const i = cur.findIndex((x) => x.productId === productId);
    if (i < 0) return;
    if (qty <= 0) {
      cur.splice(i, 1);
    } else {
      cur[i].quantity = qty;
    }
    write(cur);
  }, []);

  const remove = useCallback((productId: string) => {
    const cur = read().filter((x) => x.productId !== productId);
    write(cur);
  }, []);

  const clear = useCallback(() => write([]), []);

  const subtotal = parsed.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = parsed.reduce((s, i) => s + i.quantity, 0);

  return { items: parsed, add, setQty, remove, clear, subtotal, count };
}

export function useCartCount() {
  const items = useSyncExternalStore(
    subscribe,
    () => String(read().reduce((s, i) => s + i.quantity, 0)),
    () => "0",
  );
  return Number(items);
}

// SSR-safe hydration helper
export function useCartHydrated() {
  const items = useSyncExternalStore(
    subscribe,
    () => JSON.stringify(read()),
    () => "[]",
  );
  return JSON.parse(items) as CartItem[];
}
