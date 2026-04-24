import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { WWLogo } from "@/components/brand/Logo";
import {
  IconArrow,
  IconBell,
  IconBucket,
  IconCar,
  IconCarWash,
  IconDown,
  IconGift,
  IconPin,
  IconSearch,
  IconSparkle,
  IconSpray,
  IconStarFill,
  IconTruck,
} from "@/components/icons";
import { Card } from "@/components/ui/Card";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { displayDist, displaySlot, listStoresWithMinPrice } from "@/lib/queries/stores";
import { IMG } from "@/lib/images";

export const dynamic = "force-dynamic";

const services = [
  { name: "셀프세차", Icon: IconSpray, hint: "BAY 예약", href: "/app/stores?type=self" },
  { name: "손세차", Icon: IconBucket, hint: "매장 방문", href: "/app/stores?type=hand" },
  { name: "배달세차", Icon: IconTruck, hint: "픽업·딜리버리", accent: true, href: "/app/stores?type=pickup" },
  { name: "출장세차", Icon: IconCarWash, hint: "방문 서비스", href: "/app/stores?type=visit" },
  { name: "프리미엄", Icon: IconSparkle, hint: "자동세차", href: "/app/stores?type=premium" },
  { name: "마켓", Icon: IconGift, hint: "세차용품", href: "/app/market" },
];

export default async function AppHomePage() {
  const session = await auth();
  const [nearby, myCar, lastDone] = await Promise.all([
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
      <Header />
      <div>
        <section className="px-5 pb-[18px]">
          <div className="flex items-center gap-1 mb-[10px]">
            <IconPin size={16} stroke={1.8} />
            <div className="text-[13px] font-semibold">서울 강남구 역삼동</div>
            <IconDown size={14} stroke={2} className="text-slate" />
          </div>
          <div className="ww-disp text-[28px] leading-[1.15]">
            오늘도 빛나는
            <br />
            드라이브 되세요
          </div>
        </section>

        <section className="px-5 pb-6">
          <Link
            href="/app/stores"
            className="h-12 bg-cloud rounded-[12px] flex items-center gap-[10px] px-4"
          >
            <IconSearch size={18} stroke={1.8} className="text-slate" />
            <div className="text-[14px] text-slate flex-1">
              내 주변 세차장을 찾아보세요
            </div>
          </Link>
        </section>

        <section className="px-5 pb-6">
          <div className="grid grid-cols-3 gap-[10px]">
            {services.map((s) => (
              <Link
                key={s.name}
                href={s.href}
                className={`aspect-square rounded-[16px] p-[14px] flex flex-col justify-between transition active:scale-[0.97] ${
                  s.accent ? "bg-ink text-white" : "bg-cloud text-ink"
                }`}
              >
                <s.Icon size={22} stroke={1.5} />
                <div>
                  <div className="text-[13px] font-bold tracking-[-0.3px]">
                    {s.name}
                  </div>
                  <div className="text-[10px] font-medium opacity-55 mt-[2px]">
                    {s.hint}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="px-5 pb-6">
          <Link
            href="/app/pass"
            className="block rounded-[18px] overflow-hidden relative text-white"
          >
            <div className="ww-gradient-ink absolute inset-0" />
            <div className="absolute -right-5 -top-5 w-[120px] h-[120px] rounded-full border border-white/10" />
            <div className="absolute -right-10 -top-10 w-[180px] h-[180px] rounded-full border border-white/5" />
            <div className="relative px-6 py-5">
              <div className="text-[11px] font-semibold opacity-60 mb-[6px] tracking-[0.5px]">
                MEMBERSHIP
              </div>
              <div className="text-[18px] font-extrabold leading-[1.3] mb-[10px] tracking-[-0.3px]">
                할인패스로 세차비
                <br />
                <span className="text-accent-sky">최대 50% 할인</span>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-[7px] rounded-full bg-white text-ink text-[12px] font-bold">
                자세히 보기 <IconArrow size={12} stroke={2.2} />
              </span>
            </div>
          </Link>
        </section>

        {myCar && (
          <section className="px-5 pb-3">
            <div className="flex items-baseline justify-between mb-3">
              <div className="text-[17px] font-extrabold tracking-[-0.4px]">
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

        <section className="px-5 pt-6">
          <div className="flex items-baseline justify-between mb-[14px]">
            <div>
              <div className="text-[11px] font-semibold text-slate tracking-[0.5px] mb-[2px]">
                NEARBY
              </div>
              <div className="text-[17px] font-extrabold tracking-[-0.4px]">
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
                    <div className="flex items-center gap-[6px] mt-[2px] mb-[6px] text-[11px]">
                      <IconStarFill size={11} />
                      <span className="font-semibold">{s.rating.toFixed(1)}</span>
                      <span className="text-slate">({s.reviewCount})</span>
                      <span className="text-ash">·</span>
                      <span className="text-slate">{displayDist(s.id)}</span>
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
      </div>
    </>
  );
}

function Header() {
  return (
    <header className="px-5 pt-3 pb-4 flex items-center justify-between">
      <WWLogo size={18} compact />
      <div className="flex gap-[14px] items-center">
        <div className="relative">
          <IconBell size={22} stroke={1.6} />
          <span className="absolute top-0 right-0 w-[6px] h-[6px] rounded-full bg-accent" />
        </div>
      </div>
    </header>
  );
}
