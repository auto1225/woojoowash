import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IconHeart, IconStarFill } from "@/components/icons";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { displayDist } from "@/lib/queries/stores";
import { IMG } from "@/lib/images";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login?callbackUrl=/app/favorites");

  const favs = await db.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      store: {
        include: { products: { select: { price: true } } },
      },
    },
  });

  return (
    <>
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-baseline justify-between">
          <div className="ww-disp text-[26px] tracking-[-0.02em]">즐겨찾기</div>
          <IconHeart size={22} stroke={1.8} />
        </div>
      </div>
      <div className="px-5">
        {favs.length === 0 ? (
          <div className="pt-20 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-cloud flex items-center justify-center mb-4">
              <IconHeart size={24} stroke={1.6} className="text-slate" />
            </div>
            <div className="text-[14px] text-slate mb-4">
              아직 즐겨찾기한 매장이 없어요.
            </div>
            <Link
              href="/app/stores"
              className="inline-flex h-11 items-center px-5 rounded-full bg-ink text-white text-[13px] font-bold"
            >
              매장 둘러보기
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {favs.map((f) => {
              const s = f.store;
              const cover =
                Array.isArray(s.coverImages) && s.coverImages.length > 0
                  ? (s.coverImages as string[])[0]
                  : IMG.store1;
              const priceFrom =
                s.products.length > 0
                  ? Math.min(...s.products.map((p) => p.price))
                  : null;
              return (
                <Link
                  key={s.id}
                  href={`/app/stores/${s.id}`}
                  className="p-[14px] rounded-[16px] border border-fog bg-white flex gap-[14px]"
                >
                  <div className="relative w-[82px] h-[82px] rounded-[12px] shrink-0 overflow-hidden">
                    <Image
                      src={cover}
                      alt={s.name}
                      fill
                      className="object-cover"
                      sizes="90px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-bold">{s.name}</div>
                    <div className="flex items-center gap-[6px] mt-[2px] mb-[6px] text-[11px]">
                      <IconStarFill size={11} />
                      <span className="font-semibold">{s.rating.toFixed(1)}</span>
                      <span className="text-slate">({s.reviewCount})</span>
                      <span className="text-ash">·</span>
                      <span className="text-slate">{displayDist(s.id)}</span>
                    </div>
                    <div className="text-[13px] font-extrabold ww-num">
                      {priceFrom !== null
                        ? `${priceFrom.toLocaleString("ko-KR")}원~`
                        : "문의"}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
