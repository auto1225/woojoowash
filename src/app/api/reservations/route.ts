import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { storeId, productId, startAt } = body as {
    storeId?: string;
    productId?: string;
    startAt?: string;
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

  const defaultCar = await db.car.findFirst({
    where: { userId: session.user.id, isDefault: true },
  });

  const start = startAt ? new Date(startAt) : new Date(Date.now() + 60 * 60 * 1000);

  const reservation = await db.reservation.create({
    data: {
      userId: session.user.id,
      storeId,
      productId,
      carId: defaultCar?.id,
      startAt: start,
      durationMin: product.durationMin,
      price: product.price,
      status: "CONFIRMED",
      payment: {
        create: {
          method: "EASY",
          amount: product.price,
          status: "DONE",
          paidAt: new Date(),
        },
      },
    },
    select: { id: true },
  });

  return NextResponse.json(reservation, { status: 201 });
}
