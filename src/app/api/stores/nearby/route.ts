import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/stores/nearby?swLat=..&swLng=..&neLat=..&neLng=..
// 또는 GET /api/stores/nearby?lat=..&lng=..&radiusKm=..
export async function GET(req: Request) {
  const url = new URL(req.url);
  const swLat = parseFloat(url.searchParams.get("swLat") ?? "");
  const swLng = parseFloat(url.searchParams.get("swLng") ?? "");
  const neLat = parseFloat(url.searchParams.get("neLat") ?? "");
  const neLng = parseFloat(url.searchParams.get("neLng") ?? "");

  const lat = parseFloat(url.searchParams.get("lat") ?? "");
  const lng = parseFloat(url.searchParams.get("lng") ?? "");
  const radiusKm = parseFloat(url.searchParams.get("radiusKm") ?? "5");

  let bbox:
    | { swLat: number; swLng: number; neLat: number; neLng: number }
    | null = null;

  if (
    Number.isFinite(swLat) &&
    Number.isFinite(swLng) &&
    Number.isFinite(neLat) &&
    Number.isFinite(neLng)
  ) {
    bbox = { swLat, swLng, neLat, neLng };
  } else if (Number.isFinite(lat) && Number.isFinite(lng)) {
    // 대략적인 환산: 위도 1도 ≈ 111km, 경도 1도 ≈ 88km (한국 위도 기준)
    const dLat = radiusKm / 111;
    const dLng = radiusKm / 88;
    bbox = {
      swLat: lat - dLat,
      swLng: lng - dLng,
      neLat: lat + dLat,
      neLng: lng + dLng,
    };
  }

  const stores = await db.store.findMany({
    where: bbox
      ? {
          lat: { gte: bbox.swLat, lte: bbox.neLat },
          lng: { gte: bbox.swLng, lte: bbox.neLng },
        }
      : {},
    include: { products: { select: { price: true } } },
    orderBy: { rating: "desc" },
    take: 50,
  });

  const data = stores.map((s) => ({
    id: s.id,
    name: s.name,
    address: s.address,
    lat: s.lat,
    lng: s.lng,
    coverImage: Array.isArray(s.coverImages)
      ? ((s.coverImages as string[])[0] ?? null)
      : null,
    services: s.services,
    rating: s.rating,
    reviewCount: s.reviewCount,
    open: s.open,
    priceFrom:
      s.products.length > 0
        ? Math.min(...s.products.map((p) => p.price))
        : null,
  }));

  return NextResponse.json({ stores: data });
}
