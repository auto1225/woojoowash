import { PrismaClient, ProductType } from "@prisma/client";

const db = new PrismaClient();

const STORES = [
  {
    id: "gangnam",
    name: "우주워시 강남점",
    address: "서울 강남구 테헤란로 123",
    phone: "02-555-0001",
    lat: 37.5009,
    lng: 127.0363,
    coverImages: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=900&q=80",
    ],
    services: ["self", "hand"],
    rating: 4.9,
    reviewCount: 284,
    open: true,
  },
  {
    id: "yeoksam",
    name: "우주워시 역삼점",
    address: "서울 강남구 역삼로 45",
    phone: "02-555-0002",
    lat: 37.5004,
    lng: 127.0367,
    coverImages: [
      "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=900&q=80",
    ],
    services: ["self", "market"],
    rating: 4.8,
    reviewCount: 512,
    open: true,
  },
  {
    id: "seolleung",
    name: "우주워시 선릉점",
    address: "서울 강남구 선릉로 202",
    phone: "02-555-0003",
    lat: 37.5045,
    lng: 127.049,
    coverImages: [
      "https://images.unsplash.com/photo-1552519507-88aa2dfa9fdb?auto=format&fit=crop&w=900&q=80",
    ],
    services: ["hand", "premium"],
    rating: 4.7,
    reviewCount: 198,
    open: true,
  },
  {
    id: "samseong",
    name: "우주워시 삼성점",
    address: "서울 강남구 테헤란로 511",
    phone: "02-555-0004",
    lat: 37.508,
    lng: 127.056,
    coverImages: [
      "https://images.unsplash.com/photo-1534093607318-f025413f49cb?auto=format&fit=crop&w=900&q=80",
    ],
    services: ["visit"],
    rating: 4.9,
    reviewCount: 341,
    open: false,
  },
];

const PRODUCTS_BY_STORE: Record<
  string,
  Array<{
    id: string;
    type: ProductType;
    title: string;
    subtitle: string;
    description: string;
    durationMin: number;
    price: number;
    images: string[];
    options: Array<{ id: string; label: string; price: number }>;
    cautions: string[];
  }>
> = {
  gangnam: [
    {
      id: "gangnam_basic",
      type: "HAND",
      title: "기본(베이직) 디테일링",
      subtitle: "외부 손세차 + 실내 청소",
      description:
        "매일 타는 내 차를 정갈하게 리셋. 외부 폼/핸드워시, 실내 청소, 유리 발수까지 한 번에.",
      durationMin: 60,
      price: 55000,
      images: [
        "https://images.unsplash.com/photo-1605618826115-fb9e0cd26085?auto=format&fit=crop&w=1200&q=80",
      ],
      options: [
        { id: "wax", label: "왁스 코팅 (+12개월)", price: 15000 },
        { id: "tire", label: "타이어·휠 광택", price: 8000 },
        { id: "glass", label: "유리 발수 코팅", price: 6000 },
        { id: "inner", label: "실내 살균/탈취", price: 10000 },
      ],
      cautions: [
        "차량이 많이 오염되어 있으면 추가요금이 발생할 수 있어요",
        "잔여물 제거는 기본 범위에 포함돼요",
      ],
    },
    {
      id: "gangnam_premium",
      type: "PREMIUM",
      title: "프리미엄 디테일링",
      subtitle: "외·내부 풀케어 + 폴리싱",
      description:
        "출고 직전 수준의 광택. 외부 폼 세차 후 2단 폴리싱, 내부 스팀, 가죽·패브릭 케어.",
      durationMin: 150,
      price: 180000,
      images: [
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
      ],
      options: [
        { id: "coating", label: "유리 코팅 (6개월)", price: 40000 },
        { id: "leather", label: "가죽 시트 복원", price: 30000 },
      ],
      cautions: [
        "예약 1시간 전까지 무료 취소, 이후는 취소 수수료가 발생해요",
        "소요시간은 차량 상태에 따라 달라질 수 있어요",
      ],
    },
  ],
  yeoksam: [
    {
      id: "yeoksam_self_30",
      type: "SELF",
      title: "셀프세차 30분",
      subtitle: "BAY 단독 사용",
      description:
        "도구가 다 준비된 BAY에서 내 속도로 세차. 동전 없이 앱 결제로 끝.",
      durationMin: 30,
      price: 7000,
      images: [
        "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=80",
      ],
      options: [],
      cautions: ["시간 초과 시 10분당 추가 과금"],
    },
  ],
};

async function main() {
  // users
  const demo = await db.user.upsert({
    where: { email: "demo@woojoowash.kr" },
    update: {},
    create: {
      email: "demo@woojoowash.kr",
      name: "김우주",
      phone: "010-1234-5678",
    },
  });

  await db.car.upsert({
    where: { id: "demo_car_1" },
    update: {},
    create: {
      id: "demo_car_1",
      userId: demo.id,
      brand: "현대",
      model: "그랜저 IG",
      plate: "12가 3456",
      color: "펄 화이트",
      isDefault: true,
    },
  });

  // stores
  for (const s of STORES) {
    await db.store.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    });
  }

  // products
  for (const [storeId, products] of Object.entries(PRODUCTS_BY_STORE)) {
    for (const p of products) {
      await db.product.upsert({
        where: { id: p.id },
        update: { ...p, storeId },
        create: { ...p, storeId },
      });
    }
  }

  // sample coupons
  await db.coupon.upsert({
    where: { id: "coupon_first" },
    update: {},
    create: {
      id: "coupon_first",
      userId: demo.id,
      title: "첫 예약 3,000원 할인",
      discountType: "FLAT",
      amount: 3000,
      expiresAt: new Date("2026-12-31"),
    },
  });

  console.log(
    `✓ seeded: user=${demo.email}, stores=${STORES.length}, products=${
      Object.values(PRODUCTS_BY_STORE).flat().length
    }`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
