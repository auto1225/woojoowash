import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { IconCar, IconSearch } from "@/components/icons";
import { HeroCarousel } from "@/components/app/HeroCarousel";
import {
  getActiveHeroes,
  getActiveMarketProducts,
} from "@/lib/queries/content";
import { getFlag } from "@/lib/settings";
import { Card } from "@/components/ui/Card";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  displayDist,
  displaySlot,
  listStoresWithMinPrice,
} from "@/lib/queries/stores";
import { IMG } from "@/lib/images";

export const dynamic = "force-dynamic";

type ServiceKind = "self" | "hand" | "visit" | "pickup";
type ServiceItem = {
  kind: ServiceKind;
  name: string;
  iconSrc: string;
  href: string;
};

const SERVICES: ServiceItem[] = [
  {
    kind: "self",
    name: "셀프세차",
    iconSrc: "/services/self.png",
    href: "/app/stores?type=self",
  },
  {
    kind: "hand",
    name: "손세차",
    iconSrc: "/services/hand.png",
    href: "/app/stores?type=hand",
  },
  {
    kind: "visit",
    name: "출장세차",
    iconSrc: "/services/visit.png",
    href: "/app/stores?type=visit",
  },
  {
    kind: "pickup",
    name: "배달세차",
    iconSrc: "/services/pickup.png",
    href: "/app/stores?type=pickup",
  },
];

const FALLBACK_HERO = [
  {
    src: IMG.hero,
    subtitle: "우주워시",
    title: "세차 예약 플랫폼",
  },
];

export default async function AppHomePage() {
  const session = await auth();
  const shopEnabled = await getFlag("shopEnabled");
  const [heroes, marketItems, nearby, myCar, lastDone] = await Promise.all([
    getActiveHeroes(),
    shopEnabled ? getActiveMarketProducts(6) : Promise.resolve([]),
    listStoresWithMinPrice(),
    session?.user
      ? db.car.findFirst({
          where: { userId: session.user.id, isDefault: true },
        })
      : Promise.resolve(null),
    session?.user
      ? db.reservation.findFirst({
          where: { userId: session.user.id, status: "DONE" },
          orderBy: { startAt: "desc" },
          select: { startAt: true },
        })
      : Promise.resolve(null),
  ]);

  const lastWashLabel = lastDone
    ? formatDistanceToNow(lastDone.startAt, { addSuffix: true, locale: ko })
    : null;

  return (
    <>
      <HeroCarousel slides={heroes.length > 0 ? heroes : FALLBACK_HERO} />

      <section className="px-5 pt-6">
        <Link
          href="/app/stores"
          className="h-12 bg-cloud rounded-[14px] flex items-center gap-[10px] px-4"
        >
          <IconSearch size={18} stroke={1.8} className="text-slate" />
          <div className="text-[14px] text-slate flex-1">
            내 주변 세차장을 찾아보세요
          </div>
        </Link>
      </section>

      <section className="px-5 pt-5">
        <div className="grid grid-cols-2 gap-[10px]">
          {SERVICES.map((s) => (
            <Link
              key={s.kind}
              href={s.href}
              className="relative rounded-[18px] p-4 aspect-[1.45/1] flex items-stretch bg-cloud text-ink active:scale-[0.98] transition overflow-hidden"
            >
              <div className="flex-1 min-w-0 relative z-10">
                <div className="text-[16px] font-extrabold leading-[1.2] tracking-[-0.02em]">
                  {s.name}
                </div>
              </div>
              <div className="absolute right-2 bottom-1 w-[96px] h-[96px] pointer-events-none">
                <Image
                  src={s.iconSrc}
                  alt={s.name}
                  fill
                  className="object-contain"
                  sizes="96px"
                  priority
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 pt-5">
        <Link
          href="/app/pass"
          className="block relative rounded-[16px] overflow-hidden ww-gradient-ink text-white px-5 py-5"
        >
          <div className="absolute -right-4 -top-4 w-[140px] h-[140px] rounded-full border border-white/10" />
          <div className="absolute -right-10 -top-10 w-[200px] h-[200px] rounded-full border border-white/5" />
          <div className="text-[18px] font-extrabold tracking-[-0.02em] leading-[1.3] mb-1">
            할인패스 구독
          </div>
          <div className="text-[12px] opacity-70 mb-3">
            첫 달 50% 할인 · 월 9,900원부터
          </div>
          <GiftSvg />
        </Link>
      </section>

      <section className="px-5 pt-5">
        <div className="relative rounded-[16px] overflow-hidden bg-[#FFF4E8] p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[18px] ww-disp text-accent">
                셀프 선물 쿠폰
              </div>
              <div className="text-[12px] text-slate mt-1">
                지인에게 세차 한 잔 선물하기
              </div>
            </div>
            <div className="text-[13px] font-extrabold bg-[#FFE0A8] text-[#6B4A0A] rounded-full px-3 py-[6px]">
              셀프 30분 무료
            </div>
          </div>
        </div>
      </section>

      {myCar && (
        <section className="px-5 pt-5">
          <div className="flex items-baseline justify-between mb-3">
            <div className="text-[16px] font-extrabold tracking-[-0.3px]">
              내 차량
            </div>
            <Link
              href="/app/me/cars"
              className="text-[12px] text-slate font-medium"
            >
              관리
            </Link>
          </div>
          <Card className="p-4">
            <div className="flex items-center gap-[14px]">
              <div className="w-11 h-11 rounded-[12px] bg-cloud flex items-center justify-center">
                <IconCar size={22} stroke={1.6} />
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-bold">
                  {myCar.brand} {myCar.model}
                </div>
                <div className="text-[11px] text-slate font-medium">
                  {myCar.plate}
                  {myCar.color ? ` · ${myCar.color}` : ""}
                </div>
              </div>
              {lastWashLabel && (
                <div className="text-right">
                  <div className="text-[10px] text-slate font-medium">
                    최근 세차
                  </div>
                  <div className="text-[12px] font-bold mt-[2px]">
                    {lastWashLabel}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </section>
      )}

      {shopEnabled && marketItems.length > 0 && (
      <section className="pt-6">
        <div className="flex items-baseline justify-between px-5 mb-3">
          <div className="text-[16px] font-extrabold tracking-[-0.3px]">
            마켓
          </div>
          <Link
            href="/app/market"
            className="text-[12px] text-slate font-medium"
          >
            전체
          </Link>
        </div>
        <div className="overflow-x-auto ww-scroll-x">
          <div className="flex gap-3 pl-5 pr-5 pb-1">
            {marketItems.map((m) => (
              <Link
                key={m.id}
                href="/app/market"
                className="shrink-0 w-[132px] active:opacity-80 transition"
              >
                <div className="relative w-[132px] h-[132px] rounded-[14px] overflow-hidden bg-cloud">
                  <Image
                    src={m.imageUrl}
                    alt={m.name}
                    fill
                    className="object-cover"
                    sizes="140px"
                  />
                  {m.tag && (
                    <span
                      className={`absolute left-2 top-2 text-[9px] font-extrabold px-[6px] py-[2px] rounded ${
                        m.tag === "BEST"
                          ? "bg-ink text-white"
                          : "bg-accent text-white"
                      }`}
                    >
                      {m.tag}
                    </span>
                  )}
                </div>
                <div className="mt-2 text-[13px] font-bold truncate">
                  {m.name}
                </div>
                <div className="text-[14px] font-extrabold ww-num mt-[2px]">
                  {m.price.toLocaleString("ko-KR")}원
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      )}

      <section className="px-5 pt-6">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="text-[11px] font-semibold text-slate tracking-[0.5px] mb-[2px]">
              NEARBY
            </div>
            <div className="text-[16px] font-extrabold tracking-[-0.3px]">
              지금 예약 가능한 매장
            </div>
          </div>
          <Link href="/app/stores" className="text-[12px] text-slate font-medium">
            전체
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {nearby.slice(0, 3).map((s) => {
            const cover = s.coverImages[0] ?? IMG.store1;
            const slot = displaySlot(s.id);
            return (
              <Link
                key={s.id}
                href={`/app/stores/${s.id}`}
                className="p-3 rounded-[16px] border border-fog bg-white flex gap-3"
              >
                <div className="relative w-[86px] h-[86px] rounded-[12px] shrink-0 overflow-hidden">
                  <Image
                    src={cover}
                    alt={s.name}
                    fill
                    className="object-cover"
                    sizes="90px"
                  />
                </div>
                <div className="flex-1 min-w-0 py-[2px]">
                  <div className="text-[14px] font-bold truncate">{s.name}</div>
                  <div className="text-[11px] text-slate mt-[2px] mb-[6px]">
                    ★ {s.rating.toFixed(1)} ({s.reviewCount}) ·{" "}
                    {displayDist(s.id)}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] text-accent font-bold">
                      {slot || "예약 가능"}
                    </div>
                    <div className="text-[13px] font-extrabold ww-num">
                      {s.priceFrom !== null
                        ? `${s.priceFrom.toLocaleString("ko-KR")}원~`
                        : "문의"}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}

function GiftSvg() {
  return (
    <svg
      width="120"
      height="90"
      viewBox="0 0 120 90"
      className="absolute right-3 -bottom-2"
      aria-hidden
    >
      <rect x="22" y="42" width="52" height="40" rx="4" fill="#FF6F3C" />
      <rect x="22" y="42" width="52" height="10" fill="#FF4F1F" />
      <rect x="44" y="42" width="8" height="40" fill="#FFD600" />
      <rect x="18" y="38" width="60" height="10" rx="3" fill="#FF4F1F" />
      <rect x="44" y="38" width="8" height="10" fill="#FFD600" />
      <path
        d="M48 38 Q40 28 32 32 Q28 36 36 40 Z"
        fill="#FFD600"
        stroke="#0A0A0B"
        strokeWidth="1"
      />
      <path
        d="M48 38 Q56 28 64 32 Q68 36 60 40 Z"
        fill="#FFD600"
        stroke="#0A0A0B"
        strokeWidth="1"
      />
      <text
        x="48"
        y="68"
        fontSize="11"
        fontWeight="800"
        fill="#fff"
        textAnchor="middle"
        fontFamily="Pretendard"
      >
        50%
      </text>
      <circle cx="90" cy="20" r="3" fill="#fff" opacity="0.8" />
      <circle cx="104" cy="34" r="2" fill="#fff" opacity="0.6" />
      <circle cx="10" cy="28" r="2" fill="#fff" opacity="0.5" />
    </svg>
  );
}
