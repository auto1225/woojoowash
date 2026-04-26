import { db } from "@/lib/db";

// Store 카드에 필요한 최소 필드 + 최저 상품가.
export async function listStoresWithMinPrice() {
  const stores = await db.store.findMany({
    orderBy: { rating: "desc" },
    include: {
      products: { select: { price: true } },
    },
  });
  return stores.map((s) => ({
    id: s.id,
    name: s.name,
    address: s.address,
    phone: s.phone,
    coverImages: Array.isArray(s.coverImages)
      ? (s.coverImages as string[])
      : [],
    services: s.services,
    rating: s.rating,
    reviewCount: s.reviewCount,
    open: s.open,
    priceFrom:
      s.products.length > 0
        ? Math.min(...s.products.map((p) => p.price))
        : null,
  }));
}

export async function getStore(id: string) {
  const store = await db.store.findUnique({
    where: { id },
    include: {
      products: { orderBy: { price: "asc" } },
    },
  });
  if (!store) return null;
  return {
    ...store,
    coverImages: Array.isArray(store.coverImages)
      ? (store.coverImages as string[])
      : [],
  };
}

export async function getProduct(storeId: string, productId: string) {
  const product = await db.product.findFirst({
    where: { id: productId, storeId },
    include: {
      store: { select: { id: true, name: true, address: true } },
    },
  });
  if (!product) return null;
  return {
    ...product,
    images: Array.isArray(product.images) ? (product.images as string[]) : [],
    options: Array.isArray(product.options)
      ? (product.options as Array<{
          id: string;
          label: string;
          price: number;
          priceMode?: "amount" | "free" | "ask";
          durationMin?: number;
        }>)
      : [],
  };
}

// 프로토타입용 mock 거리/슬롯 (Sprint 4에서 좌표+실시간 스케줄로 교체)
const DIST_BY_ID: Record<string, string> = {
  gangnam: "0.4km",
  yeoksam: "0.8km",
  seolleung: "1.2km",
  samseong: "1.6km",
};
const SLOT_BY_ID: Record<string, string> = {
  gangnam: "오늘 14:30 가능",
  yeoksam: "즉시 이용 가능",
};

export function displayDist(id: string): string {
  return DIST_BY_ID[id] ?? "—";
}

export function displaySlot(id: string): string | undefined {
  return SLOT_BY_ID[id];
}
