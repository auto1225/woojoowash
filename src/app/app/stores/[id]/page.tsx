import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppBar } from "@/components/app/AppBar";
import {
  IconClock,
  IconPin,
  IconStarFill,
} from "@/components/icons";
import { MOCK_PRODUCTS, MOCK_STORES } from "@/lib/mock/stores";

export default function StoreDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const store = MOCK_STORES.find((s) => s.id === params.id);
  if (!store) return notFound();

  const products = MOCK_PRODUCTS.filter((p) => p.storeId === store.id).length > 0
    ? MOCK_PRODUCTS.filter((p) => p.storeId === store.id)
    : MOCK_PRODUCTS;

  return (
    <div className="pb-[120px]">
      <div className="relative h-[260px]">
        <Image
          src={store.cover}
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
            {store.types.map((t) => (
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
          <span className="font-bold">{store.rating}</span>
          <span className="text-slate">({store.reviews})</span>
          <span className="text-ash">·</span>
          <span className="text-slate">{store.dist}</span>
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
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/app/stores/${store.id}/products/${p.id}`}
            className="rounded-[16px] border border-fog p-3 bg-white flex gap-3 active:bg-paper transition"
          >
            <div className="relative w-[92px] h-[92px] rounded-[12px] shrink-0 overflow-hidden">
              <Image
                src={p.hero}
                alt={p.title}
                fill
                className="object-cover"
                sizes="100px"
              />
            </div>
            <div className="flex-1 min-w-0 py-1">
              <div className="text-[11px] text-slate font-medium mb-[2px]">
                {p.duration}분 소요
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
        ))}
      </div>
    </div>
  );
}
