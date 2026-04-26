/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const STORE_ID = "gangnam";
const DEMO_EMAIL = "demo@woojoowash.kr";

// Unsplash 차/세차 관련 — next.config 의 remotePatterns 와 일치
const PHOTO_PRESETS: string[][] = [
  [
    "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1591768793355-74d04bb6608f?auto=format&fit=crop&w=900&q=80",
  ],
  [],
  [
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80",
  ],
];

const SAMPLE_REVIEWS: Array<{
  daysAgo: number;
  productId: string;
  rating: number;
  body: string;
  photos: string[];
  reply?: { body: string; daysAgo: number };
}> = [
  {
    daysAgo: 30,
    productId: "gangnam_premium",
    rating: 5,
    body: "완전 만족이에요! 신차 출고 받은 느낌이 들 정도로 깔끔하게 해주셨어요. 특히 가죽 시트 부분 케어가 정말 꼼꼼하더라고요. 다음에도 또 이용할게요 :)",
    photos: PHOTO_PRESETS[0],
    reply: {
      daysAgo: 29,
      body: "소중한 후기 정말 감사드립니다 고객님! 다음에도 더 정성껏 모시겠습니다. 강남점 사장 올림.",
    },
  },
  {
    daysAgo: 18,
    productId: "gangnam_basic",
    rating: 4,
    body: "가성비 좋은 베이직 코스로 충분했습니다. 기다리는 동안 커피도 무료로 주셔서 좋았어요. 다만 예약시간보다 살짝 늦어진 점은 아쉬웠네요.",
    photos: PHOTO_PRESETS[1],
    reply: {
      daysAgo: 17,
      body: "이용해주셔서 감사합니다! 시간 지연으로 불편을 드려 죄송합니다 — 다음 방문에는 더 빠르게 모시겠습니다.",
    },
  },
  {
    daysAgo: 9,
    productId: "gangnam_basic",
    rating: 5,
    body: "픽업 가까이 살아서 자주 이용 중인데 늘 깔끔합니다. 친절한 응대도 좋아요!",
    photos: PHOTO_PRESETS[2],
  },
  {
    daysAgo: 4,
    productId: "gangnam_premium",
    rating: 5,
    body:
      "여름 유막 제거 + 발수 코팅까지 받았는데, 비 오는 날 운전이 정말 편해졌어요. 가격 대비 이정도면 진짜 추천합니다.\n사진 몇 장 첨부해요!",
    photos: PHOTO_PRESETS[3],
  },
];

function pickStartAt(daysAgo: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(11, 0, 0, 0);
  return d;
}

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
  });
  if (!user) throw new Error(`사용자 ${DEMO_EMAIL} 가 없습니다.`);

  const store = await prisma.store.findUnique({ where: { id: STORE_ID } });
  if (!store) throw new Error(`매장 ${STORE_ID} 가 없습니다.`);

  // 기본 차량 한 대 보장
  let car = await prisma.car.findFirst({
    where: { userId: user.id, isDefault: true },
  });
  if (!car) {
    car = await prisma.car.create({
      data: {
        userId: user.id,
        brand: "현대",
        model: "쏘나타",
        plate: "12가 3456",
        color: "화이트",
        isDefault: true,
      },
    });
    console.log(`▶ 기본 차량 등록: ${car.brand} ${car.model}`);
  }

  for (const sample of SAMPLE_REVIEWS) {
    const product = await prisma.product.findUnique({
      where: { id: sample.productId },
    });
    if (!product) {
      console.warn(`상품 ${sample.productId} 가 없어 스킵.`);
      continue;
    }

    const startAt = pickStartAt(sample.daysAgo);

    // 이미 같은 시간 예약이 있으면 건너뜀
    const existingReservation = await prisma.reservation.findFirst({
      where: { userId: user.id, storeId: store.id, startAt },
    });
    let reservation =
      existingReservation ??
      (await prisma.reservation.create({
        data: {
          userId: user.id,
          storeId: store.id,
          productId: product.id,
          carId: car.id,
          startAt,
          durationMin: product.durationMin,
          price: product.price,
          status: "DONE",
        },
      }));

    if (existingReservation) {
      // 상태 보장
      reservation = await prisma.reservation.update({
        where: { id: reservation.id },
        data: { status: "DONE" },
      });
    }

    // 리뷰 upsert
    const review = await prisma.review.upsert({
      where: { reservationId: reservation.id },
      create: {
        reservationId: reservation.id,
        userId: user.id,
        storeId: store.id,
        rating: sample.rating,
        body: sample.body,
        photos: sample.photos,
        reply: sample.reply?.body ?? null,
        repliedAt: sample.reply ? pickStartAt(sample.reply.daysAgo) : null,
      },
      update: {
        rating: sample.rating,
        body: sample.body,
        photos: sample.photos,
        reply: sample.reply?.body ?? null,
        repliedAt: sample.reply ? pickStartAt(sample.reply.daysAgo) : null,
      },
    });

    console.log(
      `▶ 예약 ${reservation.id.slice(0, 8)} (${product.title}, ${
        sample.daysAgo
      }일 전) → 리뷰 ${review.id.slice(0, 8)} (★ ${sample.rating})`,
    );
  }

  // 매장 평균 평점 / 리뷰 수 갱신
  const all = await prisma.review.findMany({
    where: { storeId: store.id },
    select: { rating: true },
  });
  const reviewCount = all.length;
  const avg =
    reviewCount === 0
      ? 0
      : all.reduce((s, r) => s + r.rating, 0) / reviewCount;
  await prisma.store.update({
    where: { id: store.id },
    data: {
      rating: Math.round(avg * 10) / 10,
      reviewCount,
    },
  });
  console.log(
    `\n✅ 강남점 평균 평점 ${avg.toFixed(1)} · 총 ${reviewCount}건 갱신 완료`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
