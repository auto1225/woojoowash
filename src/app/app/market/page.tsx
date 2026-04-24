import Image from "next/image";
import { AppBar } from "@/components/app/AppBar";
import { CartButton } from "@/components/app/CartButton";
import { AddToCartButton } from "./AddToCartButton";
import { getActiveMarketProducts } from "@/lib/queries/content";

export const dynamic = "force-dynamic";

export default async function MarketPage() {
  const items = await getActiveMarketProducts();
  return (
    <div className="min-h-screen bg-paper pb-[100px]">
      <AppBar title="마켓" right={<CartButton />} />
      <section className="px-5 pt-5">
        <div className="mb-5">
          <div className="ww-disp text-[22px] tracking-[-0.02em]">
            우주워시 마켓
          </div>
          <div className="text-[13px] text-slate mt-1">
            인기 상품부터 전문가 추천까지, 세차 용품을 한 번에
          </div>
        </div>
        {items.length === 0 ? (
          <div className="py-16 text-center text-slate text-[13px]">
            준비 중이에요. 곧 만나요.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {items.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-[14px] border border-fog overflow-hidden flex flex-col"
              >
                <div className="relative aspect-square">
                  <Image
                    src={m.imageUrl}
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
                          : m.tag === "NEW"
                            ? "bg-accent text-white"
                            : "bg-warning text-white"
                      }`}
                    >
                      {m.tag}
                    </span>
                  )}
                </div>
                <div className="p-3 flex flex-col gap-2 flex-1">
                  {m.category && (
                    <div className="text-[10px] text-slate font-semibold">
                      {m.category}
                    </div>
                  )}
                  <div className="text-[13px] font-bold truncate">{m.name}</div>
                  <div className="text-[14px] font-extrabold ww-num">
                    {m.price.toLocaleString("ko-KR")}원
                  </div>
                  <div className="mt-auto">
                    <AddToCartButton
                      product={{
                        id: m.id,
                        name: m.name,
                        price: m.price,
                        imageUrl: m.imageUrl,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
