import { AppBar } from "@/components/app/AppBar";
import { IconFilter } from "@/components/icons";
import {
  NaverMapFinder,
  type NearbyStore,
} from "@/components/app/NaverMapFinder";
import { db } from "@/lib/db";
import { StoreTypeFilter } from "./StoreTypeFilter";

export const dynamic = "force-dynamic";

const VALID_TYPES = ["self", "hand", "pickup", "visit"] as const;
type ServiceType = (typeof VALID_TYPES)[number];

async function loadInitialStores(
  type: ServiceType | null,
): Promise<NearbyStore[]> {
  const stores = await db.store.findMany({
    where: type ? { services: { has: type } } : undefined,
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

export default async function FinderPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  const rawType = searchParams.type ?? "";
  const type = (VALID_TYPES as readonly string[]).includes(rawType)
    ? (rawType as ServiceType)
    : null;
  const initialStores = await loadInitialStores(type);
  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID ?? null;

  return (
    <div className="pb-[90px]">
      <AppBar
        title="매장 찾기"
        right={<IconFilter size={22} stroke={1.7} />}
        border={false}
      />

      <StoreTypeFilter />

      <NaverMapFinder
        clientId={clientId}
        initialStores={initialStores}
        key={type ?? "all"}
      />
    </div>
  );
}
