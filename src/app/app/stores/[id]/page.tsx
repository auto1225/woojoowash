import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppBar } from "@/components/app/AppBar";
import {
  IconClock,
  IconPin,
  IconShield,
  IconStarFill,
} from "@/components/icons";
import { getStore, displayDist } from "@/lib/queries/stores";
import { labelServices } from "@/lib/services";
import { IMG } from "@/lib/images";

export const dynamic = "force-dynamic";

export default async function StoreDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const store = await getStore(params.id);
  if (!store) return notFound();

  const cover = store.coverImages[0] ?? IMG.store1;
  const labels = labelServices(store.services);

  return (
    <div className="pb-[120px]">
      <div className="relative h-[260px]">
        <Image
          src={cover}
          alt={store.name}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 480px) 100vw, 480px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
        <AppBar dark border={false} showBack />
        <div className="absolute left-4 right-4 bottom-4 text-white">
          <div className="flex gap-2 mb-3">
            {labels.map((t) => (
              <span
                key={t}
                className="text-[10px] font-bold px-[10px] py-[4px] rounded-full bg-white/15 ww-backdrop-glass border border-white/20"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="ww-disp text-[26px] tracking-[-0.02em]">
            {store.name}
          </div>
        </div>
      </div>

      <div className="px-5 pt-5">
        <div className="flex items-center gap-[6px] text-[12px]">
          <IconStarFill size={12} />
          <span className="font-bold">{store.rating.toFixed(1)}</span>
          <span className="text-slate">({store.reviewCount})</span>
          <span className="text-ash">·</span>
          <span className="text-slate">{displayDist(store.id)}</span>
        </div>
        <div className="flex items-center gap-2 mt-3 text-[12px] text-slate">
          <IconPin size={14} stroke={1.6} />
          {store.address}
        </div>
        <div className="flex items-center gap-2 mt-1 text-[12px] text-slate">
          <IconClock size={14} stroke={1.6} />
          오늘 10:00 — 22:00 (쉬는 시간 13:00 — 14:00)
        </div>
      </div>

      <div className="mt-6 px-5 flex gap-[2px] border-b border-fog">
        {["상품", "정보", "리뷰"].map((t, i) => (
          <div
            key={t}
            className={`flex-1 text-center py-3 text-[14px] font-bold ${
              i === 0 ? "text-ink border-b-2 border-ink" : "text-slate"
            }`}
          >
            {t}
          </div>
        ))}
      </div>

      <div className="px-5 pt-5 flex flex-col gap-3">
        {store.products.length === 0 ? (
          <div className="py-16 text-center text-slate text-[13px]">
            등록된 상품이 없어요.
          </div>
        ) : (
          store.products.map((p) => {
            const images = Array.isArray(p.images) ? (p.images as string[]) : [];
            const img = images[0];
            return (
              <Link
                key={p.id}
                href={`/app/stores/${store.id}/products/${p.id}`}
                className="rounded-[16px] border border-fog p-3 bg-white flex gap-3 active:bg-paper transition"
              >
                <div className="relative w-[92px] h-[92px] rounded-[12px] shrink-0 overflow-hidden bg-cloud">
                  {img ? (
                    <Image
                      src={img}
                      alt={p.title}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <IconShield
                        size={30}
                        stroke={1.3}
                        className="text-graphite opacity-60"
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <div className="text-[11px] text-slate font-medium mb-[2px]">
                    {p.durationMin}분 소요
                  </div>
                  <div className="text-[15px] font-extrabold tracking-[-0.3px] mb-1">
                    {p.title}
                  </div>
                  <div className="text-[12px] text-slate line-clamp-1 mb-2">
                    {p.subtitle}
                  </div>
                  <div className="text-[15px] font-extrabold ww-num">
                    {p.price.toLocaleString("ko-KR")}원
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
