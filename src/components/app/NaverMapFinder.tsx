"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import type {
  NaverMap,
  NaverMarker,
} from "@/types/naver-map";
import { IconPin, IconSearch, IconStarFill } from "@/components/icons";
import { labelServices } from "@/lib/services";
import { IMG } from "@/lib/images";

export type NearbyStore = {
  id: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  coverImage: string | null;
  services: string[];
  rating: number;
  reviewCount: number;
  open: boolean;
  priceFrom: number | null;
};

const DEFAULT_CENTER = { lat: 37.4979, lng: 127.0276 }; // 강남역

export function NaverMapFinder({
  clientId,
  initialStores,
  selectedType,
  onStoresChange,
}: {
  clientId: string | null;
  initialStores: NearbyStore[];
  /** 지도/리스트 표시를 카테고리로 필터 — null/"" 이면 전체 */
  selectedType?: string | null;
  /** 가시 영역 내 매장(전체 카테고리)이 바뀔 때마다 호출 */
  onStoresChange?: (stores: NearbyStore[]) => void;
}) {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<NaverMap | null>(null);
  const markersRef = useRef<Map<string, NaverMarker>>(new Map());

  const [ready, setReady] = useState(false);
  const [stores, setStores] = useState<NearbyStore[]>(initialStores);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showReSearch, setShowReSearch] = useState(false);

  // 부모에 가시 매장 알림
  useEffect(() => {
    onStoresChange?.(stores);
  }, [stores, onStoresChange]);

  // 카테고리 필터 적용 (마커·리스트 둘 다)
  const visibleStores = selectedType
    ? stores.filter((s) => s.services.includes(selectedType))
    : stores;

  // SDK 스크립트 onload → setReady
  useEffect(() => {
    if (!clientId) return;
    if (window.naver?.maps) {
      setReady(true);
      return;
    }
    window.__wwOnNaverMapReady = () => setReady(true);
  }, [clientId]);

  // 지도 초기화
  useEffect(() => {
    if (!ready || !mapEl.current) return;
    if (!window.naver) return;
    const { naver } = window;
    const map = new naver.maps.Map(mapEl.current, {
      center: new naver.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
      zoom: 14,
      scaleControl: false,
      logoControl: true,
      mapDataControl: false,
      zoomControl: true,
      zoomControlOptions: { position: naver.maps.Position.TOP_RIGHT },
    });
    mapRef.current = map;

    // 내 위치로 이동
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const ll = new naver.maps.LatLng(
            pos.coords.latitude,
            pos.coords.longitude,
          );
          map.setCenter(ll);
          map.setZoom(15);
          fetchByBounds();
        },
        () => {
          // 권한 거부 시 기본 위치 유지
          fetchByBounds();
        },
      );
    } else {
      fetchByBounds();
    }

    const idleListener = naver.maps.Event.addListener(map, "idle", () => {
      setShowReSearch(true);
    });

    return () => {
      naver.maps.Event.removeListener(idleListener);
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // 마커 동기화
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.naver) return;
    const { naver } = window;

    const next = new Map<string, NaverMarker>();

    visibleStores.forEach((s) => {
      if (s.lat == null || s.lng == null) return;
      const existing = markersRef.current.get(s.id);
      const position = new naver.maps.LatLng(s.lat, s.lng);
      const icon = priceMarkerIcon(s, selectedId === s.id);
      if (existing) {
        existing.setPosition(position);
        existing.setIcon(icon);
        existing.setZIndex(selectedId === s.id ? 200 : 50);
        next.set(s.id, existing);
      } else {
        const marker = new naver.maps.Marker({
          position,
          map,
          title: s.name,
          icon,
          zIndex: selectedId === s.id ? 200 : 50,
        });
        naver.maps.Event.addListener(marker, "click", () => {
          setSelectedId(s.id);
          const el = document.getElementById(`store-${s.id}`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        });
        next.set(s.id, marker);
      }
    });

    // 삭제된 마커 제거
    markersRef.current.forEach((m, id) => {
      if (!next.has(id)) m.setMap(null);
    });
    markersRef.current = next;
  }, [visibleStores, selectedId]);

  async function fetchByBounds() {
    const map = mapRef.current;
    if (!map) return;
    const b = map.getBounds();
    const sw = b.getSW();
    const ne = b.getNE();
    setLoading(true);
    try {
      const res = await fetch(
        `/api/stores/nearby?swLat=${sw.lat()}&swLng=${sw.lng()}&neLat=${ne.lat()}&neLng=${ne.lng()}`,
      );
      const j = (await res.json()) as { stores: NearbyStore[] };
      setStores(j.stores);
      setShowReSearch(false);
    } finally {
      setLoading(false);
    }
  }

  if (!clientId) {
    return <MapNotConfigured stores={initialStores} />;
  }

  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`}
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />

      <div className="relative h-[340px] bg-cloud shrink-0 isolate z-0 overflow-hidden">
        <div ref={mapEl} className="w-full h-full" />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center text-slate text-[13px]">
            지도를 불러오는 중…
          </div>
        )}
        {showReSearch && ready && (
          <button
            type="button"
            onClick={fetchByBounds}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-ink text-white px-4 py-2 rounded-full text-[12px] font-semibold flex items-center gap-[6px] shadow-ww-pop"
          >
            <IconSearch size={14} stroke={2} />
            {loading ? "검색 중…" : "이 지역에서 재검색"}
          </button>
        )}
      </div>

      <div className="px-5 pt-4 pb-[10px] flex items-center justify-between">
        <div>
          <div className="text-[11px] text-slate font-medium mb-[2px]">
            지도 영역 내
          </div>
          <div className="text-[18px] font-extrabold tracking-[-0.4px] ww-num">
            {visibleStores.length}개 매장
          </div>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-3 pb-4">
        {visibleStores.length === 0 ? (
          <div className="py-10 text-center text-slate text-[13px]">
            이 지역에는 등록된 매장이 없어요.
          </div>
        ) : (
          visibleStores.map((s) => (
            <StoreCard
              key={s.id}
              store={s}
              selected={selectedId === s.id}
              onSelect={() => {
                setSelectedId(s.id);
                if (s.lat != null && s.lng != null && window.naver && mapRef.current) {
                  mapRef.current.panTo(
                    new window.naver.maps.LatLng(s.lat, s.lng),
                  );
                }
              }}
            />
          ))
        )}
      </div>
    </>
  );
}

function StoreCard({
  store,
  selected,
  onSelect,
}: {
  store: NearbyStore;
  selected: boolean;
  onSelect: () => void;
}) {
  const cover = store.coverImage ?? IMG.store1;
  const labels = labelServices(store.services);
  return (
    <div
      id={`store-${store.id}`}
      className={`flex gap-3 p-3 rounded-[16px] border transition ${
        selected ? "border-ink shadow-ww-card" : "border-fog"
      } bg-white`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="relative w-[84px] h-[84px] rounded-[12px] shrink-0 overflow-hidden"
        aria-label={`${store.name} 지도에서 보기`}
      >
        <Image
          src={cover}
          alt={store.name}
          fill
          className="object-cover"
          sizes="90px"
        />
      </button>
      <Link
        href={`/app/stores/${store.id}`}
        className="flex-1 min-w-0 py-[2px]"
      >
        <div className="flex items-center gap-1">
          <div className="text-[14px] font-bold truncate">{store.name}</div>
          <span
            className={`text-[9px] font-bold px-[6px] py-[2px] rounded-[4px] ${
              store.open ? "bg-accent text-white" : "bg-ash/90 text-white"
            }`}
          >
            {store.open ? "영업중" : "영업종료"}
          </span>
        </div>
        <div className="flex items-center gap-[6px] mt-[3px] mb-[6px] text-[11px]">
          <IconStarFill size={11} />
          <span className="font-semibold">{store.rating.toFixed(1)}</span>
          <span className="text-slate">({store.reviewCount})</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate mb-2 truncate">
          <IconPin size={11} stroke={1.8} />
          {store.address}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {labels.slice(0, 2).map((t) => (
              <span
                key={t}
                className="text-[10px] font-semibold px-[7px] py-[2px] rounded-[4px] bg-cloud text-graphite"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="text-[13px] font-extrabold ww-num">
            {store.priceFrom !== null
              ? `${store.priceFrom.toLocaleString("ko-KR")}원~`
              : "문의"}
          </div>
        </div>
      </Link>
    </div>
  );
}

function priceMarkerIcon(store: NearbyStore, active: boolean): { content: string } {
  const label = store.priceFrom !== null
    ? `${Math.round(store.priceFrom / 1000)}K`
    : "—";
  const bg = active ? "#0A0A0B" : "#FFFFFF";
  const fg = active ? "#FFFFFF" : "#0A0A0B";
  const border = active ? "#0A0A0B" : "#E8E8EB";
  return {
    content: `
      <div style="position:relative;transform:translate(-50%,-100%);">
        <div style="
          background:${bg};
          color:${fg};
          border:1px solid ${border};
          font:700 12px -apple-system,'Pretendard Variable',sans-serif;
          padding:6px 10px;
          border-radius:999px;
          box-shadow:0 2px 6px rgba(0,0,0,.15);
          white-space:nowrap;
        ">${label}</div>
        <div style="
          width:0;height:0;margin:0 auto;
          border-left:5px solid transparent;
          border-right:5px solid transparent;
          border-top:6px solid ${bg};
        "></div>
      </div>
    `,
  };
}

function MapNotConfigured({ stores }: { stores: NearbyStore[] }) {
  return (
    <>
      <div className="mx-5 mt-3 rounded-[14px] bg-[#FFF6E6] border border-[#F6D27A] p-4 text-[12px] leading-[1.6] text-[#6B4A0A]">
        <div className="font-bold mb-1">네이버 지도 키가 설정되지 않았어요</div>
        <p>
          <code className="bg-white/60 px-1 rounded">
            NEXT_PUBLIC_NAVER_MAP_CLIENT_ID
          </code>{" "}
          환경 변수를 <code className="bg-white/60 px-1 rounded">.env.local</code>
          에 추가하면 지도가 활성화됩니다.{" "}
          <a
            href="https://www.ncloud.com/product/applicationService/maps"
            target="_blank"
            rel="noreferrer"
            className="underline font-semibold"
          >
            네이버 클라우드 플랫폼
          </a>
          에서 발급받으세요.
        </p>
      </div>
      <div className="px-5 pt-4 pb-[10px]">
        <div className="text-[18px] font-extrabold">
          {stores.length}개 매장
        </div>
      </div>
      <div className="px-5 flex flex-col gap-3 pb-4">
        {stores.map((s) => (
          <StoreCard key={s.id} store={s} selected={false} onSelect={() => {}} />
        ))}
      </div>
    </>
  );
}
