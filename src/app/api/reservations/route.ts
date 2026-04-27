import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { storeId, productId, startAt, optionIds } = body as {
    storeId?: string;
    productId?: string;
    startAt?: string;
    optionIds?: string[];
  };

  if (!storeId || !productId) {
    return NextResponse.json(
      { error: "매장과 상품을 선택해 주세요." },
      { status: 400 },
    );
  }

  const product = await db.product.findFirst({
    where: { id: productId, storeId },
  });
  if (!product) {
    return NextResponse.json(
      { error: "상품을 찾을 수 없어요." },
      { status: 404 },
    );
  }

  // 상품의 옵션 정의에서 선택된 ID 만 매칭하여 가격·소요시간 합산
  type OptionDef = {
    id: string;
    label: string;
    price: number;
    priceMode?: "amount" | "free" | "ask";
    durationMin?: number;
  };
  const productOptions: OptionDef[] = Array.isArray(product.options)
    ? (product.options as unknown as OptionDef[])
    : [];
  const selectedSet = new Set(Array.isArray(optionIds) ? optionIds : []);
  const chosenOptions: OptionDef[] = productOptions.filter((o) =>
    selectedSet.has(o.id),
  );

  let optionsPrice = 0;
  let optionsDuration = 0;
  for (const o of chosenOptions) {
    const mode = o.priceMode ?? "amount";
    if (mode === "amount" && o.price > 0) optionsPrice += o.price;
    if (typeof o.durationMin === "number" && o.durationMin > 0) {
      optionsDuration += o.durationMin;
    }
  }

  const finalPrice = product.price + optionsPrice;
  const finalDuration = product.durationMin + optionsDuration;

  const defaultCar = await db.car.findFirst({
    where: { userId: session.user.id, isDefault: true },
  });

  const start = startAt
    ? new Date(startAt)
    : new Date(Date.now() + 60 * 60 * 1000);

  const reservation = await db.reservation.create({
    data: {
      userId: session.user.id,
      storeId,
      productId,
      carId: defaultCar?.id,
      startAt: start,
      durationMin: finalDuration,
      price: finalPrice,
      options: chosenOptions as unknown as object,
      status: "CONFIRMED",
      payment: {
        create: {
          method: "EASY",
          amount: finalPrice,
          status: "DONE",
          paidAt: new Date(),
        },
      },
    },
    select: { id: true },
  });

  return NextResponse.json(reservation, { status: 201 });
}
