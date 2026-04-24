import { AppBar } from "@/components/app/AppBar";
import { Chip } from "@/components/ui/Chip";
import { IconFilter } from "@/components/icons";
import {
  NaverMapFinder,
  type NearbyStore,
} from "@/components/app/NaverMapFinder";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// 초기 렌더: 전체 매장 (지도가 뜨기 전에도 리스트 보임)
async function loadInitialStores(): Promise<NearbyStore[]> {
  const stores = await db.store.findMany({
    include: { products: { select: { price: true } } },
    orderBy: { rating: "desc" },
    take: 30,
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
        showBack={false}
        border={false}
      />

      <div className="px-4 py-2 flex gap-[6px] overflow-x-auto ww-scroll-x">
        {["전체", "셀프", "손세차", "배달", "출장", "프리미엄"].map((t, i) => (
          <Chip key={t} size="sm" active={i === 0}>
            {t}
          </Chip>
        ))}
      </div>

      <NaverMapFinder clientId={clientId} initialStores={initialStores} />
    </div>
  );
}
