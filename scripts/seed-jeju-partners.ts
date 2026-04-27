/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";

const prisma = new PrismaClient();

type Shop = {
  name: string;
  address: string;
  phone: string;
};

const SHOPS: Shop[] = [
  { name: "부부카워시", address: "제주시 우정로10길 14", phone: "064-743-1118" },
  { name: "그랜드손세차장", address: "제주시 연동6길 9", phone: "0507-1407-9166" },
  {
    name: "마블러스 디테일링",
    address: "제주시 애월읍 항몽로 48",
    phone: "0507-1353-4504",
  },
  { name: "노형스팀세차", address: "제주시 광평동로 51", phone: "0507-1332-4557" },
  {
    name: "스팀보이 제주노형점",
    address: "제주시 노형9길 16-1",
    phone: "0507-1434-0127",
  },
  {
    name: "제주굿덴트세차",
    address: "제주시 도남로 107-2",
    phone: "0507-1328-4930",
  },
  { name: "런던손세차장", address: "제주시 남녕로 47", phone: "0507-1417-3085" },
  { name: "구남손세차", address: "제주시 중앙로 399", phone: "064-721-2918" },
  { name: "코리아스팀세차", address: "제주시 연미길 22", phone: "0507-1494-6999" },
  { name: "디테일링케이", address: "제주시 사장3길 24-1", phone: "0507-1373-5845" },
  { name: "파파카워시", address: "제주시 과원로 92", phone: "0507-1426-8598" },
  {
    name: "레트로 디테일",
    address: "제주시 연화남길 26-1",
    phone: "0507-1381-2395",
  },
  {
    name: "공룡스팀세차",
    address: "제주시 신광로8길 25-1",
    phone: "064-713-5660",
  },
  { name: "컴인워시 노형점", address: "제주시 노형로 290", phone: "064-753-7634" },
];

// 동/지역별 폴백 좌표 — Nominatim 이 도로명을 못 찾았을 때 동 중심 좌표 사용
const DONG_FALLBACK: Record<string, [number, number]> = {
  // [lat, lng]
  노형동: [33.4767, 126.4748],
  연동: [33.4889, 126.4892],
  도남동: [33.4969, 126.5188],
  이도동: [33.5103, 126.5274],
  일도동: [33.5179, 126.5316],
  외도동: [33.4856, 126.4302],
  애월읍: [33.4642, 126.3309],
  중앙로: [33.5097, 126.5219],
  광평동: [33.4729, 126.4661],
};

async function geocode(address: string): Promise<[number, number] | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    address,
  )}&format=json&limit=1&accept-language=ko`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "woojoowash-seed/1.0 (admin@woojoowash.kr)" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (!Array.isArray(data) || data.length === 0) return null;
    return [Number(data[0].lat), Number(data[0].lon)];
  } catch {
    return null;
  }
}

function fallbackByAddress(address: string): [number, number] {
  for (const key of Object.keys(DONG_FALLBACK)) {
    if (address.includes(key)) return DONG_FALLBACK[key];
  }
  // 제주시 청사 근처
  return [33.4996, 126.5312];
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9가-힣]/g, "");
}

function makePassword(): string {
  // 8자 영숫자 — 사람이 읽기 쉽도록 모호한 문자(0/O/1/l) 제외
  const chars = "23456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
  let out = "";
  const buf = randomBytes(8);
  for (let i = 0; i < 8; i++) out += chars[buf[i] % chars.length];
  return out;
}

async function main() {
  const created: Array<{
    name: string;
    storeId: string;
    ownerEmail: string;
    ownerPassword: string;
    lat: number;
    lng: number;
    geocoded: boolean;
  }> = [];

  for (const shop of SHOPS) {
    console.log(`\n▶ ${shop.name}`);

    // 1. 좌표 검색
    let coords = await geocode(shop.address);
    let geocoded = true;
    if (!coords) {
      coords = fallbackByAddress(shop.address);
      geocoded = false;
      console.log(`  ⚠ Nominatim 실패 → 동 중심 좌표 사용`);
    }
    const [lat, lng] = coords;
    console.log(`  좌표: ${lat.toFixed(4)}, ${lng.toFixed(4)}${geocoded ? "" : " (대략)"}`);

    // 2. 사장 계정 생성
    const slug = slugify(shop.name);
    const ownerEmail = `${slug}@woojoowash.kr`;
    const ownerName = `${shop.name} 사장님`;
    const password = makePassword();
    const hashed = await bcrypt.hash(password, 10);
    const owner = await prisma.user.upsert({
      where: { email: ownerEmail },
      update: { password: hashed, name: ownerName, role: "OWNER" },
      create: {
        email: ownerEmail,
        name: ownerName,
        phone: shop.phone,
        password: hashed,
        role: "OWNER",
      },
    });
    console.log(`  계정: ${ownerEmail} / ${password}`);

    // 3. 매장 생성/갱신
    const storeId = `jeju-${slug}`;
    const store = await prisma.store.upsert({
      where: { id: storeId },
      update: {
        name: shop.name,
        address: shop.address,
        phone: shop.phone,
        lat,
        lng,
        services: ["hand"],
        ownerId: owner.id,
        open: true,
      },
      create: {
        id: storeId,
        name: shop.name,
        address: shop.address,
        phone: shop.phone,
        lat,
        lng,
        services: ["hand"],
        ownerId: owner.id,
        open: true,
        rating: 0,
        reviewCount: 0,
      },
    });
    console.log(`  매장: ${store.id}`);

    // 4. 기본 손세차 상품 1개 (없으면 추가)
    const existingProduct = await prisma.product.findFirst({
      where: { storeId: store.id },
    });
    if (!existingProduct) {
      await prisma.product.create({
        data: {
          storeId: store.id,
          type: "HAND",
          title: "기본 손세차",
          subtitle: "외부 손세차 + 실내 간단 청소",
          durationMin: 60,
          price: 50000,
          images: [],
        },
      });
      console.log(`  기본 상품 1개 추가`);
    }

    created.push({
      name: shop.name,
      storeId: store.id,
      ownerEmail,
      ownerPassword: password,
      lat,
      lng,
      geocoded,
    });

    // Nominatim 사용 정책 — 1초 이상 간격
    await new Promise((r) => setTimeout(r, 1100));
  }

  // 결과 요약
  console.log("\n\n========== 생성 완료 ==========\n");
  console.table(
    created.map((c) => ({
      매장: c.name,
      이메일: c.ownerEmail,
      비밀번호: c.ownerPassword,
      좌표: `${c.lat.toFixed(4)}, ${c.lng.toFixed(4)}${c.geocoded ? "" : " ⚠"}`,
    })),
  );

  console.log("\n⚠ 표시는 Nominatim 검색 실패 → 동 중심 좌표로 대체됨 (수동 보정 필요)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
