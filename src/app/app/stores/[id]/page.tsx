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
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { StoreCoverGallery } from "./StoreCoverGallery";
import { StoreActions } from "./StoreActions";
import { NavigationButton } from "./NavigationButton";
import { PhoneCallButton } from "./PhoneCallButton";
import { StoreTabs, type InfoSection, type ReviewItem } from "./StoreTabs";

export const dynamic = "force-dynamic";

export default async function StoreDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const store = await getStore(params.id);
  if (!store) return notFound();

  const images =
    store.coverImages.length > 0 ? store.coverImages : [IMG.store1];
  const labels = labelServices(store.services);

  const infoSections: InfoSection[] = Array.isArray(store.infoSections)
    ? (store.infoSections as Array<Record<string, unknown>>).map((s) => ({
        title: typeof s?.title === "string" ? s.title : "",
        subtitle: typeof s?.subtitle === "string" ? s.subtitle : "",
        content: typeof s?.content === "string" ? s.content : "",
        images: Array.isArray(s?.images)
          ? (s.images as unknown[]).filter(
              (u): u is string => typeof u === "string",
            )
          : [],
      }))
    : [];
  const defaultTab: "products" | "info" =
    infoSections.length > 0 ? "info" : "products";

  const reviewRows = await db.review.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: "desc" },
    take: 30,
    include: { user: { select: { name: true, email: true } } },
  });
  const reviews: ReviewItem[] = reviewRows.map((r) => ({
    id: r.id,
    rating: r.rating,
    body: r.body,
    photos: Array.isArray(r.photos)
      ? (r.photos as unknown[]).filter(
          (u): u is string => typeof u === "string",
        )
      : [],
    createdAt: r.createdAt.toISOString(),
    authorName: r.user.name || maskEmail(r.user.email) || "고객",
    reply: r.reply,
    repliedAt: r.repliedAt ? r.repliedAt.toISOString() : null,
  }));

  const session = await auth();
  const favorited = session?.user
    ? !!(await db.favorite.findUnique({
        where: {
          userId_storeId: { userId: session.user.id, storeId: store.id },
        },
      }))
    : false;

  return (
    <div className="pb-[120px]">
      <div className="relative">
        <StoreCoverGallery images={images} storeName={store.name} />
        <div className="absolute left-0 right-0 top-0 z-30">
          <AppBar dark border={false} showBack />
        </div>
        <div className="pointer-events-none absolute left-4 right-4 bottom-4 text-white">
          <div className="flex flex-wrap gap-2 mb-3">
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

      <div className="px-5 pt-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-[6px] text-[12px]">
            <IconStarFill size={12} />
            <span className="font-bold">{store.rating.toFixed(1)}</span>
            <span className="text-slate">({store.reviewCount})</span>
            <span className="text-ash">·</span>
            <span className="text-slate">{displayDist(store.id)}</span>
          </div>
          <StoreActions
            storeId={store.id}
            storeName={store.name}
            initialFavorited={favorited}
          />
        </div>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[12px] text-slate">
              <IconPin size={14} stroke={1.6} />
              <span className="truncate">{store.address}</span>
            </div>
            {store.phone && (
              <PhoneCallButton storeName={store.name} phone={store.phone} />
            )}
            <div className="flex items-center gap-2 text-[12px] text-slate">
              <IconClock size={14} stroke={1.6} />
              <span className="truncate">
                오늘 10:00 — 22:00 (쉬는 시간 13:00 — 14:00)
              </span>
            </div>
          </div>
          <NavigationButton
            destName={store.name}
            destAddress={store.address}
            lat={store.lat}
            lng={store.lng}
          />
        </div>

        {store.promo && (
          <div className="mt-4 rounded-[12px] bg-brand-bg border border-brand/30 p-4">
            <div className="text-[10px] font-bold text-brand-deep tracking-[0.05em] mb-1">
              매장 안내
            </div>
            <div className="text-[13px] text-graphite leading-[1.6] whitespace-pre-wrap">
              {store.promo}
            </div>
          </div>
        )}
      </div>

      <StoreTabs
        defaultTab={defaultTab}
        infoSections={infoSections}
        reviews={reviews}
        productsSlot={
          store.products.length === 0 ? (
            <div className="py-16 text-center text-slate text-[13px]">
              등록된 상품이 없어요.
            </div>
          ) : (
            store.products.map((p) => {
              const productImages = Array.isArray(p.images)
                ? (p.images as string[])
                : [];
              const img = productImages[0];
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
          )
        }
      />
    </div>
  );
}

function maskEmail(email: string | null): string | null {
  if (!email) return null;
  const at = email.indexOf("@");
  if (at <= 0) return email;
  const head = email.slice(0, at);
  const masked =
    head.length <= 2 ? head[0] + "*" : head[0] + "*".repeat(head.length - 2) + head.slice(-1);
  return masked;
}
