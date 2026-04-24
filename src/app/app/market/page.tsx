import { AppBar } from "@/components/app/AppBar";
import { IconGift } from "@/components/icons";

const ITEMS = [
  { name: "폼 샴푸 1L", price: 19800 },
  { name: "극세사 타올 3종", price: 12900 },
  { name: "유리 발수 코팅제", price: 24000 },
  { name: "세차용 폼건", price: 89000 },
];

export default function MarketPage() {
  return (
    <div className="min-h-screen bg-paper pb-[100px]">
      <AppBar title="마켓" />
      <section className="px-5 pt-5 grid grid-cols-2 gap-3">
        {ITEMS.map((m) => (
          <div
            key={m.name}
            className="bg-white rounded-[14px] border border-fog p-4"
          >
            <div className="aspect-square rounded-[10px] bg-cloud flex items-center justify-center mb-3">
              <IconGift size={32} stroke={1.2} className="text-graphite opacity-60" />
            </div>
            <div className="text-[13px] font-semibold truncate">{m.name}</div>
            <div className="text-[14px] font-extrabold ww-num mt-1">
              {m.price.toLocaleString("ko-KR")}원
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
