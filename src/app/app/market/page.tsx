import Image from "next/image";
import { AppBar } from "@/components/app/AppBar";
import { MARKET_ITEMS } from "@/lib/market";

export default function MarketPage() {
  return (
    <div className="min-h-screen bg-paper pb-[100px]">
      <AppBar title="마켓" />
      <section className="px-5 pt-5">
        <div className="mb-5">
          <div className="ww-disp text-[22px] tracking-[-0.02em]">
            우주워시 마켓
          </div>
          <div className="text-[13px] text-slate mt-1">
            인기 상품부터 전문가 추천까지, 세차 용품을 한 번에
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {MARKET_ITEMS.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-[14px] border border-fog overflow-hidden"
            >
              <div className="relative aspect-square">
                <Image
                  src={m.image}
                  alt={m.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 480px) 50vw, 200px"
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
              <div className="p-3">
                <div className="text-[13px] font-bold truncate">{m.name}</div>
                <div className="text-[14px] font-extrabold ww-num mt-1">
                  {m.price.toLocaleString("ko-KR")}원
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
