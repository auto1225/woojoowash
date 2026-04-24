import { IMG } from "@/lib/images";

export type StoreType = "self" | "hand" | "pickup" | "visit" | "premium";

export interface StoreSummary {
  id: string;
  name: string;
  dist: string;
  rating: number;
  reviews: number;
  types: string[];
  priceFrom: number;
  open: boolean;
  slot?: string;
  cover: string;
  address: string;
}

export const MOCK_STORES: StoreSummary[] = [
  {
    id: "gangnam",
    name: "우주워시 강남점",
    dist: "0.4km",
    rating: 4.9,
    reviews: 284,
    types: ["셀프", "손세차"],
    priceFrom: 8000,
    open: true,
    slot: "오늘 14:30 가능",
    cover: IMG.store1,
    address: "서울 강남구 테헤란로 123",
  },
  {
    id: "yeoksam",
    name: "우주워시 역삼점",
    dist: "0.8km",
    rating: 4.8,
    reviews: 512,
    types: ["셀프", "마켓"],
    priceFrom: 7000,
    open: true,
    slot: "즉시 이용 가능",
    cover: IMG.store2,
    address: "서울 강남구 역삼로 45",
  },
  {
    id: "seolleung",
    name: "우주워시 선릉점",
    dist: "1.2km",
    rating: 4.7,
    reviews: 198,
    types: ["손세차", "프리미엄"],
    priceFrom: 25000,
    open: true,
    cover: IMG.store3,
    address: "서울 강남구 선릉로 202",
  },
  {
    id: "samseong",
    name: "우주워시 삼성점",
    dist: "1.6km",
    rating: 4.9,
    reviews: 341,
    types: ["출장세차"],
    priceFrom: 35000,
    open: false,
    cover: IMG.store4,
    address: "서울 강남구 테헤란로 511",
  },
];

export interface ProductDetail {
  id: string;
  storeId: string;
  title: string;
  subtitle: string;
  duration: number;
  price: number;
  images?: string[];
  description: string;
  cautions: string[];
  options: { id: string; label: string; price: number }[];
  hero: string;
}

export const MOCK_PRODUCTS: ProductDetail[] = [
  {
    id: "basic",
    storeId: "gangnam",
    title: "기본(베이직) 디테일링",
    subtitle: "외부 손세차 + 실내 청소",
    duration: 60,
    price: 55000,
    hero: IMG.svcHand,
    description:
      "매일 타는 내 차를 정갈하게 리셋. 외부 폼/핸드워시, 실내 청소, 유리 발수까지 한 번에.",
    cautions: [
      "차량이 많이 오염되어 있으면 추가요금이 발생할 수 있어요",
      "잔여물 제거는 기본 범위에 포함돼요",
    ],
    options: [
      { id: "wax", label: "왁스 코팅 (+12개월)", price: 15000 },
      { id: "tire", label: "타이어·휠 광택", price: 8000 },
      { id: "glass", label: "유리 발수 코팅", price: 6000 },
      { id: "inner", label: "실내 살균/탈취", price: 10000 },
    ],
  },
  {
    id: "premium",
    storeId: "gangnam",
    title: "프리미엄 디테일링",
    subtitle: "외·내부 풀케어 + 폴리싱",
    duration: 150,
    price: 180000,
    hero: IMG.gallery2,
    description:
      "출고 직전 수준의 광택. 외부 폼 세차 후 2단 폴리싱, 내부 스팀, 가죽·패브릭 케어.",
    cautions: [
      "예약 1시간 전까지 무료 취소, 이후는 취소 수수료가 발생해요",
      "소요시간은 차량 상태에 따라 달라질 수 있어요",
    ],
    options: [
      { id: "coating", label: "유리 코팅 (6개월)", price: 40000 },
      { id: "leather", label: "가죽 시트 복원", price: 30000 },
    ],
  },
];

export const MOCK_COVER =
  "linear-gradient(135deg,#1C1C1F 0%,#3A3A3D 60%,#6E6E73 100%)";
