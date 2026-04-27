"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  NaverMapFinder,
  type NearbyStore,
} from "@/components/app/NaverMapFinder";
import { StoreTypeFilter, type TypeCounts } from "./StoreTypeFilter";

const VALID_TYPES = ["self", "hand", "pickup", "visit"] as const;

export function StoreFinderClient({
  clientId,
  initialStores,
}: {
  clientId: string | null;
  initialStores: NearbyStore[];
}) {
  const sp = useSearchParams();
  const rawType = sp.get("type") ?? "";
  const selectedType = (VALID_TYPES as readonly string[]).includes(rawType)
    ? rawType
    : "";

  const [visibleStores, setVisibleStores] =
    useState<NearbyStore[]>(initialStores);

  const handleStoresChange = useCallback((stores: NearbyStore[]) => {
    setVisibleStores(stores);
  }, []);

  // 가시 영역 내 매장으로 카테고리별 카운트 계산
  const counts: TypeCounts = useMemo(() => {
    const c: TypeCounts = {
      all: visibleStores.length,
      self: 0,
      hand: 0,
      visit: 0,
      pickup: 0,
    };
    for (const s of visibleStores) {
      if (s.services.includes("self")) c.self++;
      if (s.services.includes("hand")) c.hand++;
      if (s.services.includes("visit")) c.visit++;
      if (s.services.includes("pickup")) c.pickup++;
    }
    return c;
  }, [visibleStores]);

  return (
    <>
      <StoreTypeFilter counts={counts} />
      <NaverMapFinder
        clientId={clientId}
        initialStores={initialStores}
        selectedType={selectedType}
        onStoresChange={handleStoresChange}
      />
    </>
  );
}
