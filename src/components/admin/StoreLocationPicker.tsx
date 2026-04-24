"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import type { NaverMap, NaverMarker } from "@/types/naver-map";

const DEFAULT_CENTER = { lat: 37.4979, lng: 127.0276 }; // 강남역

export function StoreLocationPicker({
  clientId,
  initialLat,
  initialLng,
}: {
  clientId: string | null;
  initialLat: number | null;
  initialLng: number | null;
}) {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<NaverMap | null>(null);
  const markerRef = useRef<NaverMarker | null>(null);

  const [ready, setReady] = useState(false);
  const [lat, setLat] = useState<number>(initialLat ?? DEFAULT_CENTER.lat);
  const [lng, setLng] = useState<number>(initialLng ?? DEFAULT_CENTER.lng);
  const [hasCoords, setHasCoords] = useState<boolean>(
    initialLat != null && initialLng != null,
  );

  useEffect(() => {
    if (!clientId) return;
    if (window.naver?.maps) setReady(true);
  }, [clientId]);

  useEffect(() => {
    if (!ready || !mapEl.current || !window.naver) return;
    const { naver } = window;
    const startLatLng = new naver.maps.LatLng(lat, lng);
    const map = new naver.maps.Map(mapEl.current, {
      center: startLatLng,
      zoom: hasCoords ? 16 : 14,
      scaleControl: false,
      logoControl: true,
      mapDataControl: false,
      zoomControl: true,
      zoomControlOptions: { position: naver.maps.Position.TOP_RIGHT },
    });
    mapRef.current = map;

    const marker = new naver.maps.Marker({
      position: startLatLng,
      map,
      icon: pinIcon(),
    });
    // 드래그 가능 마커로 쓰려면 draggable 옵션이 필요한데
    // 여기선 지도 클릭으로 이동하는 방식이 더 직관적이라 클릭 기반.
    markerRef.current = marker;

    const clickListener = naver.maps.Event.addListener(
      map,
      "click",
      (e: unknown) => {
        const ev = e as { coord?: { lat: () => number; lng: () => number } };
        if (!ev.coord || !window.naver) return;
        const la = ev.coord.lat();
        const ln = ev.coord.lng();
        const ll = new window.naver.maps.LatLng(la, ln);
        marker.setPosition(ll);
        setLat(la);
        setLng(ln);
        setHasCoords(true);
      },
    );

    return () => {
      naver.maps.Event.removeListener(clickListener);
      marker.setMap(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  function useCurrentLocation() {
    if (!navigator.geolocation || !mapRef.current || !window.naver) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const la = pos.coords.latitude;
      const ln = pos.coords.longitude;
      const ll = new window.naver!.maps.LatLng(la, ln);
      mapRef.current!.setCenter(ll);
      mapRef.current!.setZoom(16);
      markerRef.current?.setPosition(ll);
      setLat(la);
      setLng(ln);
      setHasCoords(true);
    });
  }

  function clearCoords() {
    setHasCoords(false);
    if (mapRef.current && markerRef.current && window.naver) {
      const ll = new window.naver.maps.LatLng(
        DEFAULT_CENTER.lat,
        DEFAULT_CENTER.lng,
      );
      mapRef.current.setCenter(ll);
      markerRef.current.setPosition(ll);
    }
    setLat(DEFAULT_CENTER.lat);
    setLng(DEFAULT_CENTER.lng);
  }

  if (!clientId) {
    return (
      <div className="rounded-[14px] bg-[#FFF6E6] border border-[#F6D27A] p-5 text-[12px] leading-[1.6] text-[#6B4A0A]">
        <div className="font-bold mb-1">네이버 지도 키가 없습니다</div>
        <p>
          <code className="bg-white/70 px-1 rounded">
            NEXT_PUBLIC_NAVER_MAP_CLIENT_ID
          </code>{" "}
          를 <code className="bg-white/70 px-1 rounded">.env.local</code> 에
          추가하면 지도에서 위치를 선택할 수 있어요.
        </p>
        <input type="hidden" name="lat" value="" />
        <input type="hidden" name="lng" value="" />
      </div>
    );
  }

  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`}
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />
      <div className="relative w-full h-[340px] rounded-[14px] overflow-hidden border border-fog bg-cloud">
        <div ref={mapEl} className="w-full h-full" />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center text-slate text-[13px]">
            지도를 불러오는 중…
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 text-[12px] mt-2">
        <button
          type="button"
          onClick={useCurrentLocation}
          className="h-9 px-3 rounded-full bg-ink text-white font-semibold"
        >
          현재 내 위치로
        </button>
        <button
          type="button"
          onClick={clearCoords}
          className="h-9 px-3 rounded-full border border-fog text-slate font-semibold"
        >
          초기화
        </button>
        {hasCoords ? (
          <span className="ml-auto ww-num text-slate">
            위도 {lat.toFixed(6)}, 경도 {lng.toFixed(6)}
          </span>
        ) : (
          <span className="ml-auto text-slate">지도를 클릭해 위치를 선택하세요</span>
        )}
      </div>

      <input
        type="hidden"
        name="lat"
        value={hasCoords ? String(lat) : ""}
      />
      <input
        type="hidden"
        name="lng"
        value={hasCoords ? String(lng) : ""}
      />
    </>
  );
}

function pinIcon() {
  return {
    content: `
      <div style="transform:translate(-50%,-100%);">
        <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
          <path d="M18 2c-7.7 0-14 6.3-14 14 0 9.5 12 23 13.2 24.3.5.5 1.3.5 1.7 0C20 39 32 25.6 32 16 32 8.3 25.7 2 18 2z"
            fill="#1E40FF" stroke="#0A0A0B" stroke-width="1"/>
          <circle cx="18" cy="16" r="5.5" fill="#fff"/>
        </svg>
      </div>
    `,
  };
}
