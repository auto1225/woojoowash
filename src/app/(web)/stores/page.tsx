import Image from "next/image";
import Link from "next/link";
import { MOCK_STORES } from "@/lib/mock/stores";
import { IconPin, IconStarFill } from "@/components/icons";

export default function StoresPage() {
  return (
    <div className="mx-auto max-w-site px-5 md:px-10 py-16 md:py-20">
      <div className="mb-12 md:mb-16 max-w-[640px]">
        <div className="text-[12px] font-bold text-accent tracking-[0.15em] mb-4">
          STORES
        </div>
        <h1 className="ww-disp text-[40px] md:text-[56px] tracking-[-0.03em] leading-[1.05]">
          전국 <span className="text-accent">450개</span>의
          <br />
          엄선된 세차 매장
        </h1>
        <p className="text-slate text-[15px] leading-[1.7] mt-5">
          우주워시 품질 기준을 통과한 매장만 선별해 소개합니다. 지역별로
          둘러보고 바로 예약하세요.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_STORES.map((s) => (
          <Link
            key={s.id}
            href={`/app/stores/${s.id}`}
            className="group rounded-[22px] overflow-hidden bg-white border border-fog hover:shadow-ww-pop hover:-translate-y-[3px] transition-all duration-300"
          >
            <div className="relative aspect-[5/4] overflow-hidden">
              <Image
                src={s.cover}
                alt={s.name}
                fill
                className="object-cover group-hover:scale-[1.05] transition-transform duration-[600ms]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <div className="absolute left-4 top-4 flex gap-2">
                {s.types.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-bold px-[10px] py-[5px] rounded-full bg-white/95 text-ink"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="absolute right-4 top-4">
                <span
                  className={`text-[10px] font-bold px-[10px] py-[5px] rounded-full ${
                    s.open
                      ? "bg-accent text-white"
                      : "bg-ash/90 text-white"
                  }`}
                >
                  {s.open ? "영업중" : "영업종료"}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="text-[17px] font-extrabold tracking-[-0.3px] mb-2">
                {s.name}
              </div>
              <div className="flex items-center gap-[6px] text-[12px] mb-4">
                <IconStarFill size={12} />
                <span className="font-bold">{s.rating}</span>
                <span className="text-slate">({s.reviews})</span>
                <span className="text-ash">·</span>
                <span className="text-slate">{s.dist}</span>
              </div>
              <div className="flex items-center gap-[6px] text-[12px] text-slate mb-5">
                <IconPin size={13} stroke={1.8} />
                {s.address}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-fog">
                <span className="text-[12px] text-slate">시작 가격</span>
                <span className="ww-disp text-[20px] ww-num">
                  {s.priceFrom.toLocaleString("ko-KR")}원~
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
