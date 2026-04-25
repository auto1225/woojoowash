"use client";

import { useEffect, useState } from "react";

type App = {
  id: string;
  name: string;
  color: string;
  badge: string;
  // 클릭 시 시도할 deep link, web fallback (deep link 실패 시 자동 이동)
  deepLink?: string;
  webLink: string;
  iosOnly?: boolean;
};

export function NavigationButton({
  destName,
  destAddress,
  lat,
  lng,
}: {
  destName: string;
  destAddress: string;
  lat: number | null;
  lng: number | null;
}) {
  const [open, setOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsIOS(/iPhone|iPad|iPod/i.test(navigator.userAgent));
    }
  }, []);

  // ESC 로 닫기 + body scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const hasCoords = lat != null && lng != null;
  const encodedName = encodeURIComponent(destName);
  const encodedAddr = encodeURIComponent(destAddress);

  const apps: App[] = [
    {
      id: "naver",
      name: "네이버 지도",
      badge: "N",
      color: "#03C75A",
      deepLink: hasCoords
        ? `nmap://route/car?dlat=${lat}&dlng=${lng}&dname=${encodedName}&appname=kr.woojoowash.app`
        : `nmap://search?query=${encodedAddr}&appname=kr.woojoowash.app`,
      webLink: hasCoords
        ? `https://map.naver.com/p/directions/-/-/-/car?c=${lng},${lat},15,0,0,0,dh`
        : `https://map.naver.com/p/search/${encodedAddr}`,
    },
    {
      id: "kakao",
      name: "카카오맵",
      badge: "K",
      color: "#FFE812",
      deepLink: hasCoords
        ? `kakaomap://route?ep=${lat},${lng}&by=CAR`
        : `kakaomap://search?q=${encodedAddr}`,
      webLink: hasCoords
        ? `https://map.kakao.com/link/to/${encodedName},${lat},${lng}`
        : `https://map.kakao.com/link/search/${encodedAddr}`,
    },
    {
      id: "tmap",
      name: "T map · 원내비",
      badge: "T",
      color: "#01A0E2",
      deepLink: hasCoords
        ? `tmap://route?goalname=${encodedName}&goalx=${lng}&goaly=${lat}`
        : `tmap://search?name=${encodedAddr}`,
      webLink: "https://tmap.life",
    },
    {
      id: "google",
      name: "구글 지도",
      badge: "G",
      color: "#4285F4",
      webLink: hasCoords
        ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
        : `https://www.google.com/maps/search/?api=1&query=${encodedAddr}`,
    },
    {
      id: "apple",
      name: "Apple 지도",
      badge: "",
      color: "#000",
      iosOnly: true,
      deepLink: hasCoords
        ? `maps://?daddr=${lat},${lng}&dirflg=d`
        : `maps://?q=${encodedAddr}`,
      webLink: hasCoords
        ? `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`
        : `https://maps.apple.com/?q=${encodedAddr}`,
    },
  ];

  const visible = apps.filter((a) => !a.iosOnly || isIOS);

  function launch(app: App) {
    setOpen(false);
    if (!app.deepLink) {
      window.open(app.webLink, "_blank");
      return;
    }
    // 앱 deep link 시도 → 1.5초 안에 페이지 이동이 안 되면 웹 폴백
    const fallbackTimer = window.setTimeout(() => {
      window.location.href = app.webLink;
    }, 1500);
    const cancelFallback = () => {
      window.clearTimeout(fallbackTimer);
    };
    document.addEventListener("visibilitychange", cancelFallback, {
      once: true,
    });
    window.addEventListener("pagehide", cancelFallback, { once: true });
    window.location.href = app.deepLink;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="길찾기"
        className="flex flex-col items-center justify-center gap-1 w-[72px] h-[72px] rounded-[14px] border border-fog bg-white hover:bg-cloud active:scale-[0.97] transition shrink-0"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-brand-deep"
        >
          <polygon points="3 11 22 2 13 21 11 13 3 11" />
        </svg>
        <span className="text-[11px] font-bold text-ink">길찾기</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 ww-fade-up" />
          <div
            className="relative w-full max-w-app bg-white rounded-t-[24px] pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)] ww-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto w-10 h-1 rounded-full bg-fog mb-3" />
            <div className="px-5 pb-3">
              <div className="text-[16px] font-extrabold tracking-[-0.3px]">
                길찾기 앱 선택
              </div>
              <div className="text-[12px] text-slate mt-1 truncate">
                {destName}
                {destAddress ? ` · ${destAddress}` : ""}
              </div>
            </div>
            <ul className="flex flex-col">
              {visible.map((app) => (
                <li key={app.id}>
                  <button
                    type="button"
                    onClick={() => launch(app)}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-paper active:bg-cloud transition"
                  >
                    <span
                      className="w-11 h-11 rounded-[12px] flex items-center justify-center text-[18px] font-extrabold shrink-0"
                      style={{
                        background: app.color,
                        color: app.id === "kakao" ? "#181600" : "#fff",
                      }}
                    >
                      {app.badge ||
                        app.name.charAt(0)}
                    </span>
                    <div className="flex-1 text-left">
                      <div className="text-[15px] font-bold">{app.name}</div>
                      {!hasCoords && (
                        <div className="text-[11px] text-slate mt-[2px]">
                          좌표 미설정 · 주소 검색으로 이동
                        </div>
                      )}
                    </div>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-ash"
                    >
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
            <div className="px-5 pt-2 pb-2 text-[11px] text-slate text-center">
              앱이 없으면 웹 지도로 자동 이동돼요.
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mx-5 mt-1 mb-1 h-12 w-[calc(100%-2.5rem)] rounded-full bg-cloud text-ink font-bold text-[14px]"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </>
  );
}
