import { PrismaClient, ProductType } from "@prisma/client";
import bcrypt from "bcryptjs";

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
  const demoPassword = await bcrypt.hash("demo1234", 10);
  const demo = await db.user.upsert({
    where: { email: "demo@woojoowash.kr" },
    update: { password: demoPassword },
    create: {
      email: "demo@woojoowash.kr",
      name: "김우주",
      phone: "010-1234-5678",
      password: demoPassword,
    },
  });

  // 매장 운영자 (Owner) 데모 계정
  const ownerPassword = await bcrypt.hash("owner1234", 10);
  const owner = await db.user.upsert({
    where: { email: "owner@woojoowash.kr" },
    update: { password: ownerPassword, role: "OWNER" },
    create: {
      email: "owner@woojoowash.kr",
      name: "강남점 사장님",
      phone: "010-0000-0001",
      password: ownerPassword,
      role: "OWNER",
    },
  });

  // 서비스 관리자 (Super Admin) 데모 계정
  const adminPassword = await bcrypt.hash("admin1234", 10);
  await db.user.upsert({
    where: { email: "admin@woojoowash.kr" },
    update: { password: adminPassword, role: "ADMIN" },
    create: {
      email: "admin@woojoowash.kr",
      name: "우주워시 운영팀",
      phone: "010-0000-0000",
      password: adminPassword,
      role: "ADMIN",
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

  // stores — 강남점/역삼점은 데모 owner 소유
  for (const s of STORES) {
    const isOwned = s.id === "gangnam" || s.id === "yeoksam";
    await db.store.upsert({
      where: { id: s.id },
      update: { ...s, ownerId: isOwned ? owner.id : null },
      create: { ...s, ownerId: isOwned ? owner.id : null },
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

  // 랜딩 Hero 슬라이드
  if ((await db.homeHero.count()) === 0) {
    await db.homeHero.createMany({
      data: [
        {
          order: 0,
          subtitle: "90%가 모르는",
          title: "빠르게 광내는 법",
          imageUrl:
            "https://images.unsplash.com/photo-1600320254374-ce2d293c324e?auto=format&fit=crop&w=1600&q=80",
        },
        {
          order: 1,
          subtitle: "프리미엄 손세차",
          title: "디테일러가 직접",
          imageUrl:
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80",
        },
        {
          order: 2,
          subtitle: "회원 전용",
          title: "할인패스 50% OFF",
          imageUrl:
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
          linkHref: "/pass",
        },
      ],
    });
  }

  // 공지사항
  if ((await db.notice.count()) === 0) {
    await db.notice.createMany({
      data: [
        {
          title: "우주워시 v1.0 정식 출시 안내",
          body: "안녕하세요, 우주워시입니다. 오랜 준비 끝에 정식 서비스를 시작했어요. 많은 관심 부탁드립니다.",
          pinned: true,
          publishedAt: new Date("2026-04-01"),
        },
        {
          title: "할인패스 프로모션 (5월 한정)",
          body: "5월 한 달간 스탠다드 플랜 첫 달 70% 할인! 지금 가입하고 빛나는 세차 생활 시작하세요.",
          pinned: false,
          publishedAt: new Date("2026-04-20"),
        },
      ],
    });
  }

  // FAQ
  if ((await db.faq.count()) === 0) {
    await db.faq.createMany({
      data: [
        {
          category: "예약",
          question: "예약 취소는 언제까지 가능한가요?",
          answer:
            "이용 1시간 전까지 무료 취소 가능하며, 이후에는 예약 취소/환불 수수료 약관이 적용됩니다.",
          order: 0,
        },
        {
          category: "결제",
          question: "결제 영수증은 어떻게 받나요?",
          answer:
            "앱 내 예약 내역에서 전자영수증·현금영수증(사업자용 포함)을 발급할 수 있습니다.",
          order: 1,
        },
        {
          category: "할인패스",
          question: "할인패스는 중도 해지할 수 있나요?",
          answer:
            "다음 결제일 전까지 언제든 해지 가능합니다. 해지 후에도 남은 기간은 정상 이용됩니다.",
          order: 2,
        },
        {
          category: "Before / After",
          question: "Before / After 사진은 어떻게 저장되나요?",
          answer:
            "담당 디테일러가 앱 내에 자동 업로드하며, 마이 페이지 > Before/After 에서 확인할 수 있습니다.",
          order: 3,
        },
      ],
    });
  }

  // 마켓 상품
  if ((await db.marketProduct.count()) === 0) {
    await db.marketProduct.createMany({
      data: [
        {
          name: "폼 샴푸 1L",
          price: 19800,
          tag: "BEST",
          category: "세정제",
          imageUrl:
            "https://images.unsplash.com/photo-1607008829749-c0f284a49841?auto=format&fit=crop&w=600&q=80",
          order: 0,
        },
        {
          name: "극세사 타올 3종",
          price: 12900,
          tag: "BEST",
          category: "용품",
          imageUrl:
            "https://images.unsplash.com/photo-1622644078843-0b48d5d18b10?auto=format&fit=crop&w=600&q=80",
          order: 1,
        },
        {
          name: "유리 발수 코팅제",
          price: 24000,
          category: "코팅",
          imageUrl:
            "https://images.unsplash.com/photo-1558449907-8b82b0264682?auto=format&fit=crop&w=600&q=80",
          order: 2,
        },
        {
          name: "세차용 폼건",
          price: 89000,
          tag: "NEW",
          category: "장비",
          imageUrl:
            "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&w=600&q=80",
          order: 3,
        },
        {
          name: "프리미엄 왁스",
          price: 34000,
          category: "왁스",
          imageUrl:
            "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=600&q=80",
          order: 4,
        },
        {
          name: "타이어 광택제",
          price: 16500,
          category: "용품",
          imageUrl:
            "https://images.unsplash.com/photo-1600661653561-629509216228?auto=format&fit=crop&w=600&q=80",
          order: 5,
        },
      ],
    });
  }

  // 게시판 샘플
  if ((await db.post.count()) === 0) {
    await db.post.createMany({
      data: [
        {
          title: "강남점 첫 방문 후기",
          body: "직원분들이 너무 친절하셨고 차량도 반짝반짝해져서 돌아왔습니다. 강추!",
          authorName: "이주현",
          category: "후기",
        },
        {
          title: "출장세차 이용 꿀팁 공유",
          body: "업무 중에 맡기시려면 아침 10시 전이 가장 빠르게 예약 됩니다.",
          authorName: "박서연",
          category: "팁",
        },
      ],
    });
  }

  // 최근 30일 방문 이벤트 샘플 (간단한 randomized)
  if ((await db.siteEvent.count()) === 0) {
    const events: Array<{ kind: string; createdAt: Date; path?: string }> = [];
    for (let d = 0; d < 30; d++) {
      const date = new Date();
      date.setDate(date.getDate() - d);
      date.setHours(0, 0, 0, 0);
      const views = 20 + Math.floor(Math.random() * 200);
      for (let i = 0; i < views; i++) {
        const t = new Date(date);
        t.setMinutes(Math.floor(Math.random() * 1440));
        events.push({
          kind: "page_view",
          path: ["/home", "/stores", "/pass", "/app"][
            Math.floor(Math.random() * 4)
          ],
          createdAt: t,
        });
      }
    }
    await db.siteEvent.createMany({
      data: events.map((e) => ({
        kind: e.kind,
        path: e.path,
        createdAt: e.createdAt,
      })),
    });
  }

  // 샘플 제휴 문의
  const existingInquiries = await db.partnerInquiry.count();
  if (existingInquiries === 0) {
    await db.partnerInquiry.createMany({
      data: [
        {
          storeName: "퍼펙트 카케어 용산점",
          contactName: "박용산",
          phone: "010-1234-1111",
          address: "서울 용산구 한강대로 100",
          message: "손세차 + 픽업세차 입점 문의드립니다.",
          status: "NEW",
        },
        {
          storeName: "다이아 디테일링 하남",
          contactName: "김하남",
          phone: "010-2222-3333",
          address: "경기 하남시 미사강변로 200",
          message: "프리미엄 디테일링 전문점입니다. 우주워시와 제휴하고 싶어요.",
          status: "CONTACTED",
          memo: "3/22 상담 완료. 계약서 검토 중.",
        },
        {
          storeName: "세차왕 분당점",
          contactName: "이분당",
          phone: "010-5555-7777",
          address: "경기 성남시 분당구 정자로 50",
          status: "APPROVED",
          memo: "4/1 계약 완료, 입점 준비 중.",
        },
      ],
    });
  }

  console.log(
    `✓ seeded: user=${demo.email}, stores=${STORES.length}, products=${
      Object.values(PRODUCTS_BY_STORE).flat().length
    }, inquiries=${existingInquiries === 0 ? 3 : existingInquiries}`,
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
