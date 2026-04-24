// 마켓 인기상품 — 프로토타입용. 추후 DB 테이블로 이관.

export type MarketItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  tag?: string; // "BEST" · "NEW" 등
};

export const MARKET_ITEMS: MarketItem[] = [
  {
    id: "foam-shampoo",
    name: "폼 샴푸 1L",
    price: 19800,
    tag: "BEST",
    image:
      "https://images.unsplash.com/photo-1607008829749-c0f284a49841?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "microfiber-towel",
    name: "극세사 타올 3종",
    price: 12900,
    tag: "BEST",
    image:
      "https://images.unsplash.com/photo-1622644078843-0b48d5d18b10?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "glass-coat",
    name: "유리 발수 코팅제",
    price: 24000,
    image:
      "https://images.unsplash.com/photo-1558449907-8b82b0264682?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "foam-gun",
    name: "세차용 폼건",
    price: 89000,
    tag: "NEW",
    image:
      "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "wax",
    name: "프리미엄 왁스",
    price: 34000,
    image:
      "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "tire-shine",
    name: "타이어 광택제",
    price: 16500,
    image:
      "https://images.unsplash.com/photo-1600661653561-629509216228?auto=format&fit=crop&w=600&q=80",
  },
];

export const POPULAR_MARKET_ITEMS = MARKET_ITEMS.slice(0, 6);
