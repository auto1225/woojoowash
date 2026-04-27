import { AppBar } from "@/components/app/AppBar";
import { IconFilter } from "@/components/icons";
import { type NearbyStore } from "@/components/app/NaverMapFinder";
import { db } from "@/lib/db";
import { StoreFinderClient } from "./StoreFinderClient";

export const dynamic = "force-dynamic";

// 초기 렌더 — 전체 카테고리 매장 (카테고리 필터는 클라이언트에서 가시 영역 기준)
async function loadInitialStores(): Promise<NearbyStore[]> {
  const stores = await db.store.findMany({
    include: { products: { select: { price: true } } },
    orderBy: { rating: "desc" },
    take: 60,
  });
  return stores.map((s) => ({
    id: s.id,
    name: s.name,
    address: s.address,
    lat: s.lat,
    lng: s.lng,
    coverImage: Array.isArray(s.coverImages)
      ? ((s.coverImages as string[])[0] ?? null)
      : null,
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

export default async function FinderPage() {
  const initialStores = await loadInitialStores();
  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID ?? null;

  return (
    <div className="pb-[90px]">
      <AppBar
        title="매장 찾기"
        right={<IconFilter size={22} stroke={1.7} />}
        border={false}
      />
      <StoreFinderClient clientId={clientId} initialStores={initialStores} />
    </div>
  );
}
