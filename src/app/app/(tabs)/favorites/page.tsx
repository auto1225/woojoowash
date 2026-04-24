import Image from "next/image";
import Link from "next/link";
import { IconHeart, IconStarFill } from "@/components/icons";
import { MOCK_STORES } from "@/lib/mock/stores";

export default function FavoritesPage() {
  const favs = MOCK_STORES.slice(0, 2);
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
          <div className="pt-20 text-center text-slate">
            아직 즐겨찾기한 매장이 없어요.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {favs.map((s) => (
              <Link
                key={s.id}
                href={`/app/stores/${s.id}`}
                className="p-[14px] rounded-[16px] border border-fog bg-white flex gap-[14px]"
              >
                <div className="relative w-[82px] h-[82px] rounded-[12px] shrink-0 overflow-hidden">
                  <Image
                    src={s.cover}
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
                    <span className="font-semibold">{s.rating}</span>
                    <span className="text-slate">({s.reviews})</span>
                    <span className="text-ash">·</span>
                    <span className="text-slate">{s.dist}</span>
                  </div>
                  <div className="text-[13px] font-extrabold ww-num">
                    {s.priceFrom.toLocaleString("ko-KR")}원~
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
